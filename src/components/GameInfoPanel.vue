<template>
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
</template>

<script setup lang="ts">
import { useGameStore } from "@/store/useGame";
import { storeToRefs } from "pinia";
import { Icon } from "@iconify/vue";
import BaseTimer from "./base/BaseTimer.vue";
import BaseButton from "./base/BaseButton.vue";

const gameStore = useGameStore();
const { currentGameLevel, isTimerPaused } = storeToRefs(gameStore);
</script>

