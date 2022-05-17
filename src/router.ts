import { createRouter, createWebHistory } from "vue-router";

const history = createWebHistory();

const routes = [
    { path: "/", name: "home", component: () => import("./views/Home.vue") },
    { path: "/:catchAll(.*)*", redirect: "/" },
];

export const router = createRouter({
    history,
    routes,
    scrollBehavior() {
        // always scroll to top
        return { top: 0 };
    },
});
