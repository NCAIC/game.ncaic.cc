<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import Fade from "./components/Fade.vue";
import { ws, connect, token, latency, ended } from "./composables/core";

const Connect = defineAsyncComponent(() => import("./components/Connect.vue"));

const route = useRoute();
const router = useRouter();

const server = computed(() => (ws.value ? new URL(ws.value.url).host : "--"));

router.isReady().then(() => {
    prefill();
});

function prefill() {
    const query = { ...route.query };

    try {
        if (typeof query.url === "string" && new URL(query.url)) {
            connect(query.url);
            delete query.url;
        }
    } catch {}

    try {
        if (typeof query.token === "string") {
            token.value = query.token;
            delete query.token;
        }
    } catch {}

    router.push({ query });
}
</script>

<template>
    <div class="h-full w-full">
        <div v-if="ws || ended" class="h-full w-full overflow-hidden">
            <router-view v-slot="{ Component }">
                <Fade>
                    <component :is="Component" />
                </Fade>
            </router-view>
        </div>
        <Connect v-else></Connect>
        <div v-if="ws" class="fixed bottom-0 right-0 p-1 font-mono text-sm text-amber-500">
            connected to {{ server }} | latency {{ latency.toFixed(1) }} ms
        </div>
    </div>
</template>
