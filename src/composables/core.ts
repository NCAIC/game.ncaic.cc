import { reactive, ref } from "vue";
import Swal from "sweetalert2";
import { COLOR, Payload } from "./types";

export const ws = ref<WebSocket>();
export const token = ref("");
let latency_test_start = 0;
export const latency = ref(0);
let gracefully_closing = false;
export const data = reactive<Payload>({
    title: "測試模式 Test Mode",
    teams: [
        { name: "", color: "", time: { total: 0, set: 0, remaining: 0 }, stone: 0 },
        { name: "", color: "", time: { total: 0, set: 0, remaining: 0 }, stone: 1 },
    ],
    now: 0,
    sets: [],
    board: Array.from({ length: 15 }, () => Array.from({ length: 15 }, () => COLOR.EMPTY)),
    emphasized: [],
    clients: 0,
});
export const started = ref(false);
export const ended = ref(false);
export const playable = ref(false);

export function connect(url: string) {
    if (ws.value) {
        ws.value.close();
    }

    ws.value = new WebSocket(url);

    ws.value.addEventListener("open", () => {
        console.log("[WS] backend connected");
        Swal.fire({
            title: "Connected",
            text: `Connected to ${url}`,
            icon: "success",
            showConfirmButton: false,
            allowEnterKey: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            timer: 1000,
        });
    });
    ws.value.addEventListener("close", () => {
        console.log("[WS] backend disconnected");
        if (!gracefully_closing) {
            Swal.fire({
                title: "Disconnected",
                text: `Disconnected from ${url}`,
                icon: "info",
                showConfirmButton: false,
            });
        } else {
            gracefully_closing = false;
            ended.value = true;
            Swal.fire({
                title: "Competition ended",
                text: `Competition ended`,
                icon: "info",
                showConfirmButton: false,
                timer: 2000,
            });
        }
        ws.value = undefined;
    });
    ws.value.addEventListener("error", (err) => {
        console.error("[WS] Error. ", err);
        Swal.fire("Error", `Error connecting to ${url}`, "error");
    });
    ws.value.addEventListener("message", (msg) => {
        const data = JSON.parse(msg.data);

        if (typeof data?.token === "string") {
            token.value = data.token;
        }

        react(data.type, data.payload);
    });
}

async function react(type: string, payload?: Payload & { started?: boolean }) {
    if (payload?.board) {
        data.board = payload.board;
    }
    if (payload?.sets) {
        data.sets = payload.sets;
    }
    if (payload?.emphasized) {
        data.emphasized = payload.emphasized;
    }
    if (payload?.teams) {
        data.teams = payload.teams;
    }
    if (payload?.now !== undefined) {
        data.now = payload.now;
    }
    if (payload?.clients) {
        data.clients = payload.clients;
    }

    if (payload?.started) {
        started.value = payload.started;
    }

    if (!["pong", "client-count", "wait"].includes(type)) {
        playable.value = false;
    }

    switch (type) {
        case "competition-start":
            console.log("[WS] competition-start. ", payload);
            break;
        case "score-update":
            console.log("[WS] score-update. ", payload);
            break;
        case "competition-end":
            console.log("[WS] competition-end. ", payload);
            gracefully_closing = true;
            break;
        case "set-start":
            console.log("[WS] set-start. ", payload);
            break;
        case "set-update":
            console.log("[WS] set-update. ", payload);
            break;
        case "set-end":
            console.log("[WS] set-end. ", payload);
            break;
        case "wait":
            Swal.fire({
                title: "Wait for user interaction",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
            });
            playable.value = true;
            break;
        case "pong":
            latency.value = (Date.now() - latency_test_start) / 2;
            latency_test_start = 0;
            console.log(`[WS] latency: ${latency.value} ms`);
            break;
    }
}

export function send(type: string, payload: any) {
    if (ws.value) {
        ws.value.send(JSON.stringify({ type, payload, token: token.value }));
    }
}

window.setInterval(() => {
    if (latency_test_start === 0 && ws.value?.readyState === 1) {
        latency_test_start = Date.now();
        send("ping", {});
    }
}, 3_000);

window.setInterval(() => {
    if (started.value && !ended.value) {
        const now = data.teams.find((t) => t.stone === data.now);
        if (now) {
            now.time.remaining -= 100;
        }
    }
}, 100);
