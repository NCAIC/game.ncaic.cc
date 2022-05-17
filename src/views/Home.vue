<script setup lang="ts">
import { reactive, ref } from "vue";
import { data } from "../composables/core";
import Game from "../components/Game.vue";
</script>

<template>
    <div class="flex h-full w-full items-center justify-center">
        <div class="aspect-square h-4/5">
            <Game :board="data.board" />
        </div>
    </div>
</template>
