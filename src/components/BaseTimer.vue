<template>
    <div>
        <p>{{ timeInSeconds }}</p>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from "@/store/useGame";
const {
    timeInSeconds,
    // isTimerPaused
} = useGameStore();
</script>

