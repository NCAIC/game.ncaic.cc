import { reactive, ref } from "vue";
import Swal from "sweetalert2";
import { COLOR, Payload } from "./types";

export const ws = ref<WebSocket>();
export const token = ref("");
let latency_test_start = 0;
export const latency = ref(0);
export const messages = reactive<Required<Payload>["msg"]>([]);
export const data = reactive<Omit<Required<Payload>, "msg">>({
    board: Array.from({ length: 15 }, () => Array.from({ length: 15 }, () => COLOR.EMPTY)),
    emphasized: [],
    teams: [],
    clients: 0,
});

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
        Swal.fire({
            title: "Disconnected",
            text: `Disconnected from ${url}`,
            icon: "info",
            showConfirmButton: false,
        });
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

async function react(type: string, payload: Payload) {
    if (payload.board) {
        data.board = payload.board;
    }
    if (payload.emphasized) {
        data.emphasized = payload.emphasized;
    }
    if (payload.teams) {
        data.teams = payload.teams;
    }
    if (payload.msg) {
        messages.push(...payload.msg);
    }
    if (payload.clients) {
        data.clients = payload.clients;
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
