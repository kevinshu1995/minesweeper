import { ref, computed, toRef, type Ref, type ComputedRef } from "vue";
import useMineBox, { type UseMineBoxReturn } from "./useSingleMineBox";

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

type RevealBoxReturn = {
    type: UseMineBoxReturn["revealType"]["value"] | ReturnType<UseMineBoxReturn["updateBoxRevealType"]> | number;
};

type MineSets =
    | (Omit<UseMineBoxReturn, "updateBoxRevealType"> & {
          id: ComputedRef<string>;
          revealBox: () => RevealBoxReturn;
      })[][]
    | null;

export default function useMine(options: { totalMineCount: Ref<number>; panelSize: Ref<number> }) {
    /** @description 整個遊戲的二維陣列 */
    const mineSets = ref<MineSets>(null);
    const hasInitialized = ref(false);

    const totalMineCount = toRef(options.totalMineCount);
    const panelSize = toRef(options.panelSize);

    /** @description 所有地雷的 index 陣列 */
    const minesIndexArray = ref<number[]>([]);

    const hasRevealedMine = ref(false);

    /** @description 初始化整個遊戲的二維陣列 */
    const initMineSets = () => {
        hasInitialized.value = false;

        mineSets.value = Array.from({ length: panelSize.value }, (_, y) =>
            Array.from({ length: panelSize.value }, (_, x) => {
                const {
                    axis,
                    index,
                    revealState,
                    isMine,
                    isRevealed,
                    flagType,
                    revealType,

                    getBoxRevealType,
                    updateBoxRevealType,
                    updateFlagType,
                } = useMineBox(x, y, panelSize.value, minesIndexArray);

                /** @description 此格的 id */
                const id = computed(() => {
                    return `mine-box-${index.value}`;
                });

                /** @description 顯示這個格子的實際狀態 */
                const revealBox = () => {
                    if (isRevealed.value || hasRevealedMine.value) {
                        return { type: revealType.value };
                    }
                    tryToSetupMines && tryToSetupMines({ x, y });
                    const { type } = updateBoxRevealType();
                    if (type === "mine") {
                        // game over
                        hasRevealedMine.value = true;
                        return { type };
                    }
                    if (type === 0) {
                        function revealSurroundingBoxes(index: number) {
                            const surroundingBox = mineSets.value?.[Math.floor(index / panelSize.value)][index % panelSize.value];
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
                    revealState,
                    isMine,
                    isRevealed,
                    flagType,
                    revealType,

                    getBoxRevealType,
                    // updateBoxRevealType,
                    revealBox,
                    updateFlagType,
                };
            })
        );
    };

    /** @description 如果還沒設定的話，嘗試設定全部的地雷位置（update `minesIndexArray`） */
    const tryToSetupMines = (skipAxis: { x: number; y: number }) => {
        if (hasInitialized.value || mineSets.value === null) {
            return;
        }
        hasInitialized.value = true;
        const skipAxisIndex = skipAxis.y * panelSize.value + skipAxis.x;
        minesIndexArray.value = tryToGetRandomNumberInRange(panelSize.value, totalMineCount.value, skipAxisIndex);
    };

    return {
        mineSets,
        panelSize,
        minesIndexArray,
        hasInitialized,
        hasRevealedMine,
        initMineSets,
    };
}

export type UseMineReturn = ReturnType<typeof useMine>;

