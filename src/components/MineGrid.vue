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
const { mineSets, panelSize, gameLevelOptions } = storeToRefs(gameStore);

const gameLevel = defineModel<(typeof gameLevelOptions.value)[number]["value"]>();

const gameDialogIsOpen = defineModel<boolean>("dialog", {
    default: false,
});

function setupGameHandler() {
    if (gameLevel.value) {
        gameStore.setupGame(gameLevel.value);
    }
}
</script>

<template>
    <div class="h-dvh w-dvw flex flex-col gap-8">
        <div v-if="mineSets">
            <div v-for="(row, rowIndex) in mineSets" :key="rowIndex" class="flex">
                <div v-for="(col, colIndex) in row" :key="colIndex">
                    <MineSingleBox :mine="col" :size="panelSize" />
                </div>
            </div>
        </div>
        <div class="w-[300px]">
            <button @click="setupGameHandler">Setup Game</button>
        </div>
        <BaseTimer />
        <button @click="gameDialogIsOpen = true">Open Dialog</button>
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

