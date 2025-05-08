import { ref, computed, toRef, type Ref } from "vue";
import useMineBox from "./useSingleMineBox";
import type { MineSets } from "@/types";

function getRandomNumberInRange(max: number, count: number) {
    const min = 0;
    const unique = new Set<number>();

    while (unique.size < count) {
        let n = Math.floor(Math.random() * (max - min + 1)) + min;
        unique.add(n);
    }
    return Array.from(unique);
}

function tryToGetRandomNumberInRange(size: number, counts: number, skipAxisIndex: number) {
    const location = getRandomNumberInRange(size * size - 1, counts);
    if (location.includes(skipAxisIndex)) {
        return tryToGetRandomNumberInRange(size, counts, skipAxisIndex);
    }
    return location;
}

export default function useMine({ mineCounts, panelSize }: { mineCounts: Ref<number>; panelSize: Ref<number> }) {
    const mineSets = ref<MineSets | null>(null);
    const hasInitialized = ref(false);

    const mineCount = toRef(mineCounts);
    const gridSize = toRef(panelSize);
    const minesIndexArray = ref<number[]>([]);

    const initMineGrid = () => {
        hasInitialized.value = false;

        mineSets.value = Array.from({ length: gridSize.value }, (_, y) =>
            Array.from({ length: gridSize.value }, (_, x) => {
                const {
                    axis,
                    index,
                    isMine,
                    isRevealed,
                    flagType,
                    revealType,

                    getBoxType,
                    updateBoxType,
                    updateFlagType,
                } = useMineBox(x, y, gridSize.value, minesIndexArray);

                const id = computed(() => {
                    return `mine-box-${index.value}`;
                });

                const revealBox = () => {
                    if (isRevealed.value) {
                        return { type: revealType.value };
                    }
                    setupMines && setupMines({ x, y });
                    const { type } = updateBoxType();
                    if (type === "mine") {
                        // game over
                        return { type };
                    }
                    if (type === 0) {
                        function revealSurroundingBoxes(index: number) {
                            const surroundingBox = mineSets.value?.[Math.floor(index / gridSize.value)][index % gridSize.value];
                            if (surroundingBox && !surroundingBox.isRevealed) {
                                surroundingBox.revealBox();
                            }
                        }
                        const right = axis.value.surroundBoxesIndex.right;
                        const left = axis.value.surroundBoxesIndex.left;
                        const top = axis.value.surroundBoxesIndex.top;
                        const bottom = axis.value.surroundBoxesIndex.bottom;
                        const topRight = axis.value.surroundBoxesIndex.topRight;
                        const topLeft = axis.value.surroundBoxesIndex.topLeft;
                        const bottomRight = axis.value.surroundBoxesIndex.bottomRight;
                        const bottomLeft = axis.value.surroundBoxesIndex.bottomLeft;
                        right !== null && revealSurroundingBoxes(right);
                        left !== null && revealSurroundingBoxes(left);
                        top !== null && revealSurroundingBoxes(top);
                        bottom !== null && revealSurroundingBoxes(bottom);
                        topRight !== null && revealSurroundingBoxes(topRight);
                        topLeft !== null && revealSurroundingBoxes(topLeft);
                        bottomRight !== null && revealSurroundingBoxes(bottomRight);
                        bottomLeft !== null && revealSurroundingBoxes(bottomLeft);
                        return { type };
                    }
                    return { type };
                };

                return {
                    id,
                    axis,
                    index,
                    isMine,
                    isRevealed,
                    flagType,
                    revealType,

                    getBoxType,
                    // updateBoxType,
                    revealBox,
                    updateFlagType,
                };
            })
        );
    };

    const setupMines = (skipAxis: { x: number; y: number }) => {
        if (hasInitialized.value || mineSets.value === null) {
            return;
        }
        hasInitialized.value = true;
        const skipAxisIndex = skipAxis.y * gridSize.value + skipAxis.x;
        minesIndexArray.value = tryToGetRandomNumberInRange(gridSize.value, mineCount.value, skipAxisIndex);
    };

    return {
        mineSets,
        gridSize,
        minesIndexArray,
        hasInitialized,
        initMineGrid,
    };
}

