<template>
    <div ref="elInfoPanel" class="fixed z-10 border border-neutral-100 rounded bg-white/10" :style="style" :class="[{ 'opacity-0': !displayInfoPanel }, 'transition-opacity duration-300']">
        <div ref="elDraggingHandle" class="cursor-move flex items-center justify-center border-b border-neutral-100 text-neutral-400 py-1">
            <Icon icon="radix-icons:drag-handle-dots-2" class="rotate-90" />
        </div>
        <div class="min-w-50 text-neutral-500 text-3 py-2 px-3">
            <ul>
                <li v-for="first in devInfoContentArray" class="flex flex-wrap gap-x-2">
                    <h5 class="font-bold">{{ first.title }}</h5>
                    <template v-if="typeof first.content === 'string'">
                        <p>{{ first.content }}</p>
                    </template>
                    <template v-else>
                        <ul class="w-full ml-2 pl-2 border-l border-l-neutral-200">
                            <li v-for="second in first.content" class="flex gap-2">
                                <h6 class="font-bold">{{ second.title }}</h6>
                                <p>{{ second.content }}</p>
                            </li>
                        </ul>
                    </template>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDraggable, useWindowSize, useElementBounding } from "@vueuse/core";
import { ref, onMounted, nextTick, useTemplateRef } from "vue";
import { Icon } from "@iconify/vue";
import { useDevInfoStore } from "@/store/useDevInfo";
import { storeToRefs } from "pinia";

const devInfoStore = useDevInfoStore();
const { devInfoContentArray } = storeToRefs(devInfoStore);

const elInfoPanel = useTemplateRef<HTMLElement>("elInfoPanel");
const elDraggingHandle = useTemplateRef<HTMLElement>("elDraggingHandle");
const { height: windowHeight, width: windowWidth } = useWindowSize();
const { width: elInfoPanelWidth } = useElementBounding(elInfoPanel);
const displayInfoPanel = ref(false);

const { x, y, style } = useDraggable(elInfoPanel, {
    handle: elDraggingHandle,
});

onMounted(async () => {
    await nextTick();
    const offset = 20;
    y.value = offset;
    x.value = windowWidth.value - elInfoPanelWidth.value - offset;
    displayInfoPanel.value = true;
});
</script>

