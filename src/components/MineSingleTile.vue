<template>
    <div :class="['size-10 m-1 text-5']" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <button
            @click="mine.revealTile"
            @contextmenu.prevent="mine.updateFlagType"
            :class="['rounded-lg transition-all duration-100 shadow overflow-hidden w-full h-full border flex items-center justify-center relative', tileClass]"
        >
            <template v-if="mine.revealState === 'mine'">
                <Icon icon="material-symbols:skull" class="text-5.5" />
            </template>
            <template v-if="typeof mine.revealState === 'number' && mine.revealState !== 0">
                {{ mine.revealState }}
            </template>
            <TransitionGroup
                enter-active-class="transform-gpu transition origin-bottom duration-200 ease-out"
                leave-active-class="transform-gpu transition origin-bottom duration-200 ease-out"
                enter-from-class="opacity-0 rotate-60"
                enter-to-class="opacity-100 rotate-0"
                leave-from-class="opacity-100 rotate-0"
                leave-to-class="opacity-0 -rotate-60"
            >
                <div v-show="mine.revealState === 'question'" key="question" class="size-full absolute left-0 top-0 flex items-center justify-center">
                    <Icon icon="material-symbols:indeterminate-question-box-rounded" class="text-5.5" />
                </div>
                <div v-show="mine.revealState === 'flag'" key="flag" class="size-full absolute left-0 top-0 flex items-center justify-center">
                    <Icon icon="material-symbols:flag-rounded" class="text-5.5" />
                </div>
            </TransitionGroup>
            <div v-if="mine.isMine" class="opacity-20 absolute inset-0">💀</div>
        </button>
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { UseMineReturn } from "@/composables/useMineSet";
import { useDevInfoStore } from "@/store/useDevInfo";
// import { storeToRefs } from "pinia";
import { computed, toRaw, toValue } from "vue";

const devInfoStore = useDevInfoStore();
// const { devInfoContentArray } = storeToRefs(devInfoStore);

const props = defineProps<{
    mine: NonNullable<UseMineReturn["mineSets"]["value"]>[number][number];
    size: number;
}>();

const isZero = computed(() => {
    return props.mine.revealState === 0;
});

const tileClass = computed(() => {
    if (isZero.value) {
        return "bg-[#BBD8A3]/30 border-[#BBD8A3]";
    }
    if (typeof props.mine.revealState === "number") {
        return "bg-[#BBD8A3]/30 border-[#BBD8A3]";
    }
    if (props.mine.revealState === "question") {
        return "border-[#E16A54]/50 text-[#E16A54] hover:scale-110 cursor-pointer";
    }
    if (props.mine.revealState === "flag") {
        return "border-[#BF9264]/50 text-[#BF9264] hover:scale-110 cursor-pointer";
    }
    if (props.mine.revealState === "mine") {
        return "bg-black/80 border-black/50 text-white";
    }
    return "bg-white/10 border-neutral-300 hover:bg-white/50 hover:scale-110 cursor-pointer";
});

function formatContent<T>(value: T) {
    if (value === null) {
        return "---";
    }
    return String(value);
}

function onMouseEnter() {
    const mine = toRaw(props.mine);
    const mineInfo = Object.entries(mine)
        .map(([key]) => {
            switch (key) {
                case "axis": {
                    const value = toValue(mine[key]);
                    const content = value
                        ? {
                              x: formatContent(value.x),
                              y: formatContent(value.y),
                              bottom: formatContent(value.surroundTilesIndex.bottom),
                              top: formatContent(value.surroundTilesIndex.top),
                              left: formatContent(value.surroundTilesIndex.left),
                              right: formatContent(value.surroundTilesIndex.right),
                              "top left": formatContent(value.surroundTilesIndex.topLeft),
                              "top right": formatContent(value.surroundTilesIndex.topRight),
                              "bottom left": formatContent(value.surroundTilesIndex.bottomLeft),
                              "bottom right": formatContent(value.surroundTilesIndex.bottomRight),
                          }
                        : "";
                    return { title: "axis", content: content };
                }
                case "index": {
                    const value = formatContent(toValue(mine[key]));
                    return { title: key, content: value };
                }
                case "revealState": {
                    const value = formatContent(toValue(mine[key]));
                    return { title: key, content: value };
                }
                case "isMine": {
                    const value = toValue(mine[key]);
                    return { title: key, content: value ? "💀" : "😃" };
                }
                case "isRevealed": {
                    const value = toValue(mine[key]);
                    return { title: key, content: value ? "Revealed" : "Not Revealed" };
                }
                case "flagType": {
                    const value = formatContent(toValue(mine[key]));
                    return { title: key, content: value };
                }
                case "revealType": {
                    const value = formatContent(toValue(mine[key]));
                    return { title: key, content: value };
                }
                case "id": {
                    const value = formatContent(toValue(mine[key]));
                    return { title: key, content: value };
                }
                default:
                    return null;
            }
        })
        .filter(item => item !== null);
    mineInfo.forEach(({ title, content }) => {
        devInfoStore.updateDevInfo(title, content);
    });
}
function onMouseLeave() {}
// devInfoStore.updateDevInfo
</script>

