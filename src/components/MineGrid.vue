<script setup lang="ts">
import { provide } from "vue";
import Box from "./Box.vue";
import useMine from "@/composables/useMineSet";

const { mine, minesIndexArray, gridSize, initMineGrid, setupMines } = useMine({ mineCounts: 1, panelSize: 5 });

provide("minesIndexArray", minesIndexArray);
provide("mine", mine);
provide("setupMines", setupMines);

initMineGrid();
</script>

<template>
    <div class="flex flex-col gap-8">
        <div v-for="(row, rowIndex) in mine" :key="rowIndex" class="flex gap-4">
            <div v-for="(col, colIndex) in row" :key="colIndex" class="">
                <Box :mine="col" :size="gridSize" />
            </div>
        </div>
    </div>
</template>

