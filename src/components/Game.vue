<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import Board from "./Board.vue";
import { BoardState, check_winner, cols, rows } from "../gobang";

interface Payload {
    board: BoardState[];
    turn: number;
    current: BoardState;
    winner: {
        color: BoardState;
        stones: number[];
    };
}

const props = defineProps<{
    board: number[][];
}>();

const emit = defineEmits<{
    (event: "init", payload: Payload & { ui: { selected: boolean; marked: boolean }[] }): void;
    (event: "set", payload: Payload & { stone: { x: number; y: number; color: BoardState } }): void;
    (event: "over", payload: Payload): void;
}>();

const board: BoardState[] = reactive(Array.from({ length: 225 }, () => 0));
watch(props, () => {
    board.splice(0, board.length, ...props.board.flat());
    console.log("board", board);
});

const ui = reactive(
    Array.from({ length: cols * rows }, () => ({ selected: false, marked: false })),
);

const turn = ref(0);
const current = ref(BoardState.Black);
const winner = reactive({ color: BoardState.Empty, stones: <number[]>[] });

emit("init", { board, turn: turn.value, current: current.value, winner, ui });

defineExpose({ ui });
</script>

<template>
    <div :class="`grid h-full w-full grid-cols-[repeat(15,_minmax(0,_1fr))] bg-amber-400`">
        <Board
            v-for="(state, i) in board"
            :key="i"
            :state="state"
            :x="i % cols"
            :y="Math.floor(i / cols)"
            :selected="ui[i].selected"
            :marked="ui[i].marked"
            @mouseenter="false || (ui[i].selected = true)"
            @mouseleave="false || (ui[i].selected = false)"
            :class="[false ? 'cursor-pointer' : 'cursor-not-allowed']"
        />
    </div>
</template>
