<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { storeToRefs } from "pinia";
import MineSingleTile from "./MineSingleTile.vue";
import BaseSelect from "./base/BaseSelect.vue";
import BaseDialog from "./base/BaseDialog.vue";
import BaseButton from "./base/BaseButton.vue";
import BaseTooltip from "./base/BaseTooltip.vue";
import PauseScreen from "./PauseScreen.vue";
import GameInfoPanel from "./GameInfoPanel.vue";
import { useGameStore } from "@/store/useGame";

const gameStore = useGameStore();
const { mineSets, panelSize, gameLevelOptions, isTimerPaused } = storeToRefs(gameStore);

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
        <PauseScreen class="z-9" />
        <div v-if="mineSets" :class="[isTimerPaused && 'blur pointer-events-none']">
            <div v-for="(row, rowIndex) in mineSets" :key="rowIndex" class="flex">
                <div v-for="(col, colIndex) in row" :key="colIndex">
                    <MineSingleTile :mine="col" :size="panelSize" />
                </div>
            </div>
        </div>
        <GameInfoPanel class="z-8" />
        <BaseDialog v-model="gameDialogIsOpen" :disableEscapeOnClickOutside="true" max-width="400px">
            <template #title>
                <div class="flex gap-4 items-center mr-auto mb-16">
                    <img src="https://i.giphy.com/l3V0GQMoaDLVbjXEI.webp" class="size-24 rounded-2xl" />
                    <h1 class="font-600 text-13 leading-12 uppercase">
                        <span class="text-[#BF9264]">Mine</span> <br />
                        <span class="text-[#6F826A]"> Sweeper </span>
                    </h1>
                </div>
            </template>
            <template #default="{ close }">
                <div class="flex flex-col items-center gap-16">
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
                        <div class="flex justify-center">
                            <button
                                class="text-neutral-600 flex gap-1 items-center cursor-pointer hover:text-neutral-700 transition-all self-center px-5 relative group hover:underline underline-offset-2 transition-all"
                            >
                                <Icon
                                    icon="radix-icons:question-mark-circled"
                                    class="h-4 w-4 inline-block absolute left-0 group-hover:opacity-100 opacity-0 group-hover:translate-x-0 -translate-x-4 transition-all"
                                />
                                <span>How to play?</span>
                            </button>
                        </div>
                    </div>
                </div>
                <p class="font-400 text-2.5 text-neutral-400 mt-4 text-center">MIT Licensed | Copyright © 2025-present Wen-Hsiu Hsiu</p>
            </template>
        </BaseDialog>
    </div>
</template>

