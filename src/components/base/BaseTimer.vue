<template>
    <div>
        <p class="text-12 font-400 flex leading-9">
            <span v-for="digit in timeDigitsInArray" class="inline-flex justify-center w-7">
                {{ digit }}
            </span>
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useGameStore } from "@/store/useGame";
const gameStore = useGameStore();

const timeDigitsInArray = computed(() => {
    const timeInSeconds = gameStore.timeInSeconds;
    return String(timeInSeconds).split("").map(Number);
});
</script>

