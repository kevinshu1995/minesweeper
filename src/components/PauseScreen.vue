<template>
    <transition enter-active-class="animate-contentShow" leave-active-class="animate-contentClose">
        <div class="absolute left-50% top-50% -translate-x-50% -translate-y-50% text-[#BF9264] w-full h-full flex flex-col items-center justify-center bg-white/10" v-if="isTimerPaused">
            <button class="border-6 border-[#BF9264] rounded-full size-30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#BF9264]/30 transition-all" @click="gameStore.toggleGame">
                <Icon icon="radix-icons:pause" class="size-18" />
            </button>
            <span class="uppercase font-600 text-9">Pausing</span>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { storeToRefs } from "pinia";
import { useGameStore } from "@/store/useGame";

const gameStore = useGameStore();
const { isTimerPaused } = storeToRefs(gameStore);
</script>

