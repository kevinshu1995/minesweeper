import { ref, computed, toRef, type Ref, type ComputedRef } from "vue";
import useMineTile, { type UseMineTileReturn } from "./useSingleMineTile";
import { tryToGetRandomNumberInRange } from "@/utils";

type RevealTileReturn = {
    type: UseMineTileReturn["revealType"]["value"] | ReturnType<UseMineTileReturn["updateTileRevealType"]> | number;
};

type MineSets =
    | (Omit<UseMineTileReturn, "updateTileRevealType"> & {
          id: ComputedRef<string>;
          revealTile: () => RevealTileReturn;
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
    const flagIndexSet = ref<number[]>([]);

    const hasRevealedMine = ref(false);
    const isGameOver = computed(() => hasRevealedMine.value);
    const isGameWon = computed(() => {
        if (mineSets.value === null) {
            return false;
        }
        if (minesIndexArray.value.length === 0) return false;
        if (flagIndexSet.value.length === 0) return false;
        const isAllMinesFlagged = minesIndexArray.value.every(i => flagIndexSet.value.includes(i));
        return isAllMinesFlagged && flagIndexSet.value.length === minesIndexArray.value.length;
    });

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

                    getTileRevealType,
                    updateTileRevealType,
                    updateFlagType: _updateFlagType,
                } = useMineTile(x, y, panelSize.value, minesIndexArray);

                /** @description 此格的 id */
                const id = computed(() => {
                    return `mine-box-${index.value}`;
                });

                /** @description 顯示這個格子的實際狀態 */
                const revealTile = () => {
                    if (isRevealed.value || hasRevealedMine.value) {
                        return { type: revealType.value };
                    }
                    tryToSetupMines && tryToSetupMines({ x, y });
                    const { type } = updateTileRevealType();
                    if (type === "mine") {
                        // game over
                        hasRevealedMine.value = true;
                        return { type };
                    }
                    if (type === 0) {
                        function revealSurroundingTiles(index: number) {
                            const surroundingTile = mineSets.value?.[Math.floor(index / panelSize.value)][index % panelSize.value];
                            if (surroundingTile && !surroundingTile.isRevealed) {
                                surroundingTile.revealTile();
                            }
                        }
                        const { surroundTilesIndex } = axis.value;
                        Object.values(surroundTilesIndex).forEach(index => {
                            if (index !== null) revealSurroundingTiles(index);
                        });
                        return { type };
                    }
                    return { type };
                };

                function updateFlagType() {
                    const result = _updateFlagType();
                    if (result?.ok === false) {
                        return result;
                    }

                    if (result?.type === "flag") {
                        flagIndexSet.value.push(index.value);
                        flagIndexSet.value = [...new Set(flagIndexSet.value)];
                    } else {
                        flagIndexSet.value = flagIndexSet.value.filter(i => i !== index.value);
                    }

                    return result;
                }

                return {
                    id,
                    axis,
                    index,
                    revealState,
                    isMine,
                    isRevealed,
                    flagType,
                    revealType,

                    getTileRevealType,
                    // updateTileRevealType,
                    revealTile,
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
        isGameOver,
        isGameWon,
        initMineSets,
    };
}

export type UseMineReturn = ReturnType<typeof useMine>;

