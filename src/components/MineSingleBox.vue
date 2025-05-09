<template>
    <div class="size-10 border border-neutral-200 m-px" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <button @click="mine.revealBox" @contextmenu.prevent="mine.updateFlagType" class="w-full h-full cursor-pointer">
            {{ mine.revealState }}
            <div v-if="mine.isMine">💀</div>
        </button>
    </div>
</template>

<script setup lang="ts">
import type { UseMineReturn } from "@/composables/useMineSet";
import { useDevInfoStore } from "@/store/useDevInfo";
// import { storeToRefs } from "pinia";
import { toRaw, toValue } from "vue";

const devInfoStore = useDevInfoStore();
// const { devInfoContentArray } = storeToRefs(devInfoStore);

const props = defineProps<{
    mine: NonNullable<UseMineReturn["mineSets"]["value"]>[number][number];
    size: number;
}>();

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
                              bottom: formatContent(value.surroundBoxesIndex.bottom),
                              top: formatContent(value.surroundBoxesIndex.top),
                              left: formatContent(value.surroundBoxesIndex.left),
                              right: formatContent(value.surroundBoxesIndex.right),
                              "top left": formatContent(value.surroundBoxesIndex.topLeft),
                              "top right": formatContent(value.surroundBoxesIndex.topRight),
                              "bottom left": formatContent(value.surroundBoxesIndex.bottomLeft),
                              "bottom right": formatContent(value.surroundBoxesIndex.bottomRight),
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

