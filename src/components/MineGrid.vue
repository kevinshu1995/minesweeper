<script setup lang="ts">
import { storeToRefs } from "pinia";
import MineSingleBox from "./MineSingleBox.vue";
import BaseTimer from "./BaseTimer.vue";
import BaseSelect from "./base/BaseSelect.vue";
import { useGameStore } from "@/store/useGame";

const gameStore = useGameStore();
const { mineSets, gridSize, gameLevelOptions } = storeToRefs(gameStore);

const gameLevel = defineModel<(typeof gameLevelOptions.value)[number]["value"]>();

function setupGameHandler() {
    if (gameLevel.value) {
        gameStore.setupGame(gameLevel.value);
    }
}
</script>

<template>
    <div class="flex flex-col gap-8">
        <div v-if="mineSets">
            <div v-for="(row, rowIndex) in mineSets" :key="rowIndex" class="flex gap-4">
                <div v-for="(col, colIndex) in row" :key="colIndex">
                    <MineSingleBox :mine="col" :size="gridSize" />
                </div>
            </div>
        </div>
        <div class="w-[300px]">
            <BaseSelect :options="gameLevelOptions" placeholder="Game Level" v-model="gameLevel" />
            <button @click="setupGameHandler">Setup Game</button>
        </div>
        <BaseTimer />
    </div>
</template>

