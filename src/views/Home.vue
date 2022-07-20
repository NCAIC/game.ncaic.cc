<script setup lang="ts">
import MdiTimerAlert from "~icons/mdi/TimerAlert";
import MdiLineScan from "~icons/mdi/LineScan";
import MdiCancel from "~icons/mdi/Cancel";
import { data, started, token, send } from "../composables/core";
import Board from "../components/Board.vue";
import { SetResultType } from "../composables/types";
</script>

<template>
    <div class="flex h-full w-full items-center justify-center bg-slate-100">
        <div class="m-4 aspect-square h-4/5">
            <Board :board="data.board" class="overflow-hidden rounded" />
        </div>
        <div class="m-4 grid h-4/5 max-w-xl flex-1 grid-rows-3">
            <div class="row-span-2 m-2 flex flex-col justify-center rounded-lg p-2">
                <div class="flex flex-1 items-center">
                    <div class="w-full">
                        <div class="flex w-full justify-between">
                            <span class="px-1">
                                {{ (data.teams?.[0].time.remaining / 1000).toFixed(1) || "" }}
                            </span>
                            <span class="px-1 text-slate-500">
                                {{ (data.teams?.[0].time.total / 1000).toFixed(1) || "" }}
                            </span>
                        </div>
                        <div
                            class="h-2 w-full rounded-t bg-green-300 opacity-60 transition-all"
                            :style="{
                                background: data.teams?.[0] ? data.teams[0].color : '',
                                width: data.teams?.[0]
                                    ? (data.teams[0].time.remaining / data.teams[0].time.set) *
                                          100 +
                                      '%'
                                    : '',
                            }"
                        ></div>
                        <div
                            class="flex h-20 w-full flex-row items-center overflow-auto rounded-b border-t border-green-400 bg-green-300 p-4 text-3xl"
                            :style="{
                                background: data.teams?.[0] ? data.teams[0].color + 'cc' : '',
                                borderColor: data.teams?.[0] ? data.teams[0].color : '',
                            }"
                        >
                            <p class="flex-1">{{ data.teams?.[0].name || "" }}</p>
                            <div
                                :class="[
                                    'm-4 aspect-square h-3/5 rounded-full border border-slate-500',
                                    data.teams?.[0].stone ? 'bg-white' : 'bg-black',
                                ]"
                            ></div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-1 items-center justify-center">
                    <div
                        v-if="started"
                        v-for="(set, i) in data.sets"
                        class="m-2 flex aspect-square flex-1 items-center justify-center rounded border border-slate-300 bg-slate-200 text-xl text-slate-400 transition-all lg:text-3xl xl:text-4xl"
                        :key="i"
                        :style="{ background: set.color + '80', color: set.color }"
                    >
                        <MdiTimerAlert v-if="set.type === SetResultType.timeout" />
                        <MdiLineScan v-else-if="set.type === SetResultType.row" />
                        <MdiCancel v-else-if="set.type === SetResultType.invalid" />
                    </div>
                    <div
                        v-else-if="token"
                        class="m-2 flex w-full cursor-pointer items-center justify-center rounded-lg bg-amber-400 py-2 px-4 text-amber-50 transition-all hover:bg-amber-500 lg:text-3xl xl:text-4xl"
                        @click="send('start', {})"
                    >
                        Start!
                    </div>
                    <div
                        v-else
                        class="m-2 flex w-full animate-pulse items-center justify-center rounded-lg bg-slate-200 py-2 px-4 text-slate-400 lg:text-3xl xl:text-4xl"
                    >
                        Waiting for start ...
                    </div>
                </div>
                <div class="flex flex-1 items-center">
                    <div class="w-full">
                        <div
                            class="flex h-20 w-full flex-row items-center overflow-auto rounded-t border-b border-blue-400 bg-blue-300 p-4 text-3xl"
                            :style="{
                                background: data.teams?.[1] ? data.teams[1].color + 'cc' : '',
                                borderColor: data.teams?.[1] ? data.teams[1].color : '',
                            }"
                        >
                            <p class="flex-1">{{ data.teams?.[1].name || "" }}</p>
                            <div
                                :class="[
                                    'm-4 aspect-square h-3/5 rounded-full border border-slate-500',
                                    data.teams?.[1].stone ? 'bg-white' : 'bg-black',
                                ]"
                            ></div>
                        </div>
                        <div
                            class="h-2 w-full rounded-b bg-blue-300 opacity-60 transition-all"
                            :style="{
                                background: data.teams?.[1] ? data.teams[1].color : '',
                                width: data.teams?.[1]
                                    ? (data.teams[1].time.remaining / data.teams[1].time.set) *
                                          100 +
                                      '%'
                                    : '',
                            }"
                        ></div>
                        <div class="flex w-full justify-between">
                            <span class="px-1">
                                {{ (data.teams?.[1].time.remaining / 1000).toFixed(1) || "" }}
                            </span>
                            <span class="px-1 text-slate-500">
                                {{ (data.teams?.[1].time.total / 1000).toFixed(1) || "" }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="m-2 flex items-center justify-center rounded-lg border border-slate-200 p-2"
            >
                <p class="text-3xl text-slate-500">Advertisement</p>
            </div>
        </div>
    </div>
</template>
