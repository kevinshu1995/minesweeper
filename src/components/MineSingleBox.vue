<template>
    <div class="size-10 border border-neutral-200 m-px">
        <HoverCardRoot>
            <HoverCardTrigger>
                <button @click="mine.revealBox" @contextmenu.prevent="mine.updateFlagType" class="w-full h-full cursor-pointer">
                    {{ mine.state }}
                    <div v-if="mine.isMine">💀</div>
                </button>
            </HoverCardTrigger>
            <HoverCardPortal>
                <HoverCardContent class="bg-white w-80 shadow-xl p-4 whitespace-pre">
                    <HoverCardArrow />
                    {{ mine }}
                </HoverCardContent>
            </HoverCardPortal>
        </HoverCardRoot>
    </div>
</template>

<script setup lang="ts">
import { HoverCardArrow, HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from "reka-ui";
import type { SingleMineBoxForComponentProps } from "@/types";

defineProps<{
    mine: SingleMineBoxForComponentProps;
    size: number;
}>();
</script>

