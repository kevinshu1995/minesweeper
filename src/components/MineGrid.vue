<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { storeToRefs } from "pinia";
import MineSingleBox from "./MineSingleBox.vue";
import BaseTimer from "./base/BaseTimer.vue";
import BaseSelect from "./base/BaseSelect.vue";
import BaseDialog from "./base/BaseDialog.vue";
import BaseButton from "./base/BaseButton.vue";
import BaseTooltip from "./base/BaseTooltip.vue";
import { useGameStore } from "@/store/useGame";

const gameStore = useGameStore();
const { mineSets, panelSize, gameLevelOptions, currentGameLevel, isTimerPaused } = storeToRefs(gameStore);

const gameLevel = defineModel<(typeof gameLevelOptions.value)[number]["value"]>();

const gameDialogIsOpen = defineModel<boolean>("dialog", {
    default: true,
});

gameStore.setupGame("easy");

function setupGameHandler() {
    if (gameLevel.value) {
        gameStore.setupGame(gameLevel.value);
        gameStore.startGame();
    }
}
</script>

<template>
    <div class="h-dvh w-dvw flex flex-col items-center justify-center gap-8 relative bg-[#F0F1C5]">
        <div class="absolute left-50% top-50% -translate-x-50% -translate-y-50% text-[#BF9264] w-full h-full flex flex-col items-center justify-center bg-white/10" v-if="isTimerPaused">
            <button class="border-6 border-[#BF9264] rounded-full size-30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#BF9264]/30 transition-all" @click="gameStore.toggleGame">
                <Icon icon="radix-icons:pause" class="size-18" />
            </button>
            <span class="uppercase font-600 text-9">Pausing</span>
        </div>
        <div v-if="mineSets" :class="[isTimerPaused && 'blur pointer-events-none']">
            <div v-for="(row, rowIndex) in mineSets" :key="rowIndex" class="flex">
                <div v-for="(col, colIndex) in row" :key="colIndex">
                    <MineSingleBox :mine="col" :size="panelSize" />
                </div>
            </div>
        </div>
        <div class="absolute bottom-4 left-50% -translate-x-50%">
            <div class="bg-white rounded-2xl py-3 border border-neutral-200 flex items-center divide-neutral-200 divide-x shadow">
                <div class="flex flex-col gap-0 text-3.5 items-center px-6 self-stretch justify-center">
                    <span>Game Level</span>
                    <span class="uppercase text-[#BF9264] font-600 text-5 leading-5">{{ currentGameLevel?.label ?? "-" }}</span>
                </div>
                <div class="px-6 flex flex-col gap-1 items-center">
                    <div class="flex gap-1 items-center uppercase -translate-x-1">
                        <Icon icon="radix-icons:lap-timer" class="size-4" />
                        <p>Timer</p>
                    </div>
                    <BaseTimer />
                </div>
                <div class="px-6">
                    <BaseButton class="flex cursor-pointer rounded-full" padding="p-2" @click="gameStore.toggleGame">
                        <Icon :icon="isTimerPaused ? 'radix-icons:play' : 'radix-icons:pause'" class="size-8" />
                    </BaseButton>
                </div>
            </div>
        </div>
        <BaseDialog v-model="gameDialogIsOpen" :disableEscapeOnClickOutside="true" max-width="400px" v-slot="{ close }">
            <div>
                <div class="flex flex-col items-center gap-16">
                    <div class="flex gap-4 items-center mr-auto">
                        <img src="https://i.giphy.com/l3V0GQMoaDLVbjXEI.webp" class="size-24 rounded-2xl" />
                        <h1 class="font-600 text-13 leading-12 uppercase">
                            <span class="text-[#BF9264]">Mine</span> <br />
                            <span class="text-[#6F826A]"> Sweeper </span>
                        </h1>
                    </div>

                    <div class="w-full">
                        <div class="w-full flex flex-col gap-1 w-full items-start">
                            <p class="text-base text-neutral-700">Game Level</p>
                            <BaseSelect :options="gameLevelOptions" placeholder="Select Game Level..." v-model="gameLevel" class="w-full" />
                        </div>
                    </div>
                    <div class="w-full flex flex-col space-y-4">
                        <BaseTooltip class="w-full" :disabled="gameLevel !== undefined" :disableClosingTrigger="true">
                            <BaseButton
                                :class="['w-full uppercase']"
                                :disabled="gameLevel === undefined"
                                @click="
                                    () => {
                                        close();
                                        setupGameHandler();
                                    }
                                "
                            >
                                New Game
                            </BaseButton>
                            <template #content>
                                <span>You've not selected <span class="font-600">game level</span> yet!</span>
                            </template>
                        </BaseTooltip>
                        <button class="text-neutral-600 flex gap-1 items-center cursor-pointer hover:scale-102 hover:text-neutral-700 transition-all self-center">
                            <Icon icon="radix-icons:question-mark-circled" class="h-4 w-4 inline-block" />
                            <span>How to play?</span>
                        </button>
                    </div>
                </div>
                <p class="font-400 text-2.5 text-neutral-400 mt-4 text-center">MIT Licensed | Copyright © 2025-present Wen-Hsiu Hsiu</p>
            </div>
        </BaseDialog>
    </div>
</template>

