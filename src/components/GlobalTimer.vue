<template>
    <div>
        <p>{{ timeInSeconds }}</p>
        <button @click="toggle">toggle</button>
        <button @click="reset">reset</button>
    </div>
</template>

<script setup lang="ts">
import useTimer from "@/composables/useTimer";
const { timeInSeconds, isPaused, toggle, restart, reset } = useTimer({ secondsPadStart: 3 });
</script>

