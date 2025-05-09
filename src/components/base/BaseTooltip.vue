<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from "reka-ui";
defineProps<{
    disableClosingTrigger?: boolean;
}>();
</script>

<template>
    <TooltipProvider :disableClosingTrigger="disableClosingTrigger">
        <TooltipRoot>
            <TooltipTrigger as-child>
                <slot />
            </TooltipTrigger>
            <TooltipPortal>
                <TooltipContent
                    class="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-grass11 select-none rounded-md bg-[#F0F1C5]/90 px-4 py-4 text-sm leading-0 shadow-sm will-change-[transform,opacity] z-50"
                    :side-offset="5"
                >
                    <slot name="content" />
                    <TooltipArrow class="fill-[#F0F1C5]/90 stroke-gray-200" :width="12" :height="6" />
                </TooltipContent>
            </TooltipPortal>
        </TooltipRoot>
    </TooltipProvider>
</template>

