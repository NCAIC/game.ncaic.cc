<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import Grid from "./Grid.vue";
import { COLOR, BOARDSIZE } from "../gobang";

interface Payload {
    board: COLOR[];
    turn: number;
    current: COLOR;
    winner: {
        color: COLOR;
        stones: number[];
    };
}

const props = defineProps<{
    board: number[][];
}>();

const emit = defineEmits<{
    (event: "init", payload: Payload & { ui: { selected: boolean; marked: boolean }[] }): void;
    (event: "set", payload: Payload & { stone: { x: number; y: number; color: COLOR } }): void;
    (event: "over", payload: Payload): void;
}>();

const board: COLOR[] = reactive(Array.from({ length: 225 }, () => 0));
watch(props, () => {
    board.splice(0, board.length, ...props.board.flat());
    console.log("board", board);
});

const ui = reactive(
    Array.from({ length: BOARDSIZE * BOARDSIZE }, () => ({ selected: false, marked: false })),
);

const turn = ref(0);
const current = ref(COLOR.Black);
const winner = reactive({ color: COLOR.Empty, stones: <number[]>[] });

emit("init", { board, turn: turn.value, current: current.value, winner, ui });

defineExpose({ ui });
</script>

<template>
    <div :class="`grid h-full w-full grid-cols-[repeat(15,_minmax(0,_1fr))] bg-amber-400`">
        <Grid
            v-for="(state, i) in board"
            :key="i"
            :state="state"
            :x="i % BOARDSIZE"
            :y="Math.floor(i / BOARDSIZE)"
            :selected="ui[i].selected"
            :marked="ui[i].marked"
            @mouseenter="ui[i].selected = true"
            @mouseleave="ui[i].selected = false"
            :class="[false ? 'cursor-pointer' : 'cursor-not-allowed']"
        />
    </div>
</template>
