<script setup lang="ts">
import { ref } from "vue";
import Swal from "sweetalert2";
import { connect } from "../composables/core";

const default_url = "ws://localhost:52022";

const url = ref("");

function try_connect() {
    try {
        const server = new URL(url.value);

        if (!["ws:", "wss:"].includes(server.protocol)) {
            return Swal.fire("Error", "Only websocket protocol is supported.", "error");
        }

        connect(url.value);
        Swal.fire({
            title: "Connecting...",
            text: `Connecting to ${url.value}`,
            icon: "info",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            showConfirmButton: false,
            showCancelButton: false,
        });
    } catch (e) {
        return Swal.fire("Error", "Invalid URL.", "error");
    }
}
</script>

<template>
    <div class="flex h-full w-full items-center justify-center">
        <div
            class="flex h-40 w-80 flex-col items-center justify-center rounded-lg border border-amber-100 p-2"
        >
            <label class="block w-full text-amber-600">Server Address </label>
            <input
                class="my-2 w-full rounded-lg border border-amber-300 p-2 transition-all hover:border-amber-400 focus:border-amber-500 focus:outline-none"
                type="url"
                v-model="url"
                :placeholder="default_url"
                @keydown="
                    (e) => {
                        if (e.key === 'Tab') {
                            e.preventDefault();
                            url = default_url;
                        }
                    }
                "
            />
            <button
                class="my-2 w-full rounded-lg bg-amber-400 py-2 px-4 text-white transition-all hover:bg-amber-500 focus:bg-amber-500 focus:outline-none"
                @click="try_connect"
            >
                Connect
            </button>
        </div>
    </div>
</template>
