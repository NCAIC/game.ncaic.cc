<script setup lang="ts">
import { BoardState, cols, rows } from "../gobang";

defineProps<{
    state: BoardState;
    x: number;
    y: number;
    selected?: boolean;
    marked?: boolean;
}>();
</script>

<template>
    <div
        :class="[
            'inline-flex items-center justify-center transition-all focus:outline-none',
            selected ? 'rounded-lg bg-amber-400' : 'bg-amber-300',
        ]"
    >
        <div
            :class="[
                'absolute h-0.5 bg-black',
                x === 0 || x === cols - 1 ? 'w-1/2' : 'w-full',
                x === 0 ? 'left-1/2' : 'left-0',
            ]"
        ></div>
        <div
            :class="[
                'absolute w-0.5 bg-black',
                y === 0 || y === rows - 1 ? 'h-1/2' : 'h-full',
                y === 0 ? 'top-1/2' : 'top-0',
            ]"
        ></div>
        <div
            v-if="(x + 1) % 4 === 0 && (y + 1) % 4 === 0 && ((x + y + 2) / 4) % 2 === 0"
            :class="['absolute h-1/4 w-1/4 rounded-full bg-black']"
        ></div>

        <div
            v-if="state === BoardState.Black || state === BoardState.White"
            :class="[
                state === BoardState.Black ? 'bg-black' : 'bg-white',
                marked ? ' animate-pulse shadow-md shadow-violet-500' : '',
                'h-[70%] w-[70%] rounded-full md:h-3/5 md:w-3/5',
            ]"
        ></div>
    </div>
</template>
