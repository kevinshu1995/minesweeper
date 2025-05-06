<template>
    <div class="size-20">
        <button @click="mine.revealBox">Reveal</button>
        <PopoverRoot>
            <PopoverTrigger>
                <div class="w-10">{{ mine.revealType }}</div>
            </PopoverTrigger>
            <PopoverPortal>
                <PopoverContent class="bg-white w-80 shadow-xl p-4 whitespace-pre">
                    {{ mine }}
                </PopoverContent>
            </PopoverPortal>
        </PopoverRoot>
        <div v-if="mine.isMine">💀</div>
    </div>
</template>

<script setup lang="ts">
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from "reka-ui";
import type { SingleMineBoxForComponentProps } from "@/types";

defineProps<{
    mine: SingleMineBoxForComponentProps;
    size: number;
}>();
</script>

