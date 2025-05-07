<script setup lang="ts">
import MineSingleBox from "./MineSingleBox.vue";
import GlobalTimer from "./GlobalTimer.vue";
import useMine from "@/composables/useMineSet";

const { mineSets, gridSize, initMineGrid } = useMine({ mineCounts: 1, panelSize: 5 });

initMineGrid();
</script>

<template>
    <div class="flex flex-col gap-8">
        <div v-for="(row, rowIndex) in mineSets" :key="rowIndex" class="flex gap-4">
            <div v-for="(col, colIndex) in row" :key="colIndex">
                <MineSingleBox :mine="col" :size="gridSize" />
            </div>
        </div>
        <GlobalTimer />
    </div>
</template>

