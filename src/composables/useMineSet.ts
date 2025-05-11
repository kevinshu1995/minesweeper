import { ref, computed, toRef, type Ref, type ComputedRef } from "vue";
import useMineTile, { type UseMineTileReturn } from "./useSingleMineTile";

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
        flagIndexSet.value = [...new Set(flagIndexSet.value)];
        const _flagIndexSet = flagIndexSet.value;
        const _minesIndexArray = minesIndexArray.value;
        const isAllMinesFlagged = _flagIndexSet.every(i => _minesIndexArray.includes(i));
        return isAllMinesFlagged && _flagIndexSet.length === _minesIndexArray.length;
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
                        const right = axis.value.surroundTilesIndex.right;
                        const left = axis.value.surroundTilesIndex.left;
                        const top = axis.value.surroundTilesIndex.top;
                        const bottom = axis.value.surroundTilesIndex.bottom;
                        const topRight = axis.value.surroundTilesIndex.topRight;
                        const topLeft = axis.value.surroundTilesIndex.topLeft;
                        const bottomRight = axis.value.surroundTilesIndex.bottomRight;
                        const bottomLeft = axis.value.surroundTilesIndex.bottomLeft;
                        right !== null && revealSurroundingTiles(right);
                        left !== null && revealSurroundingTiles(left);
                        top !== null && revealSurroundingTiles(top);
                        bottom !== null && revealSurroundingTiles(bottom);
                        topRight !== null && revealSurroundingTiles(topRight);
                        topLeft !== null && revealSurroundingTiles(topLeft);
                        bottomRight !== null && revealSurroundingTiles(bottomRight);
                        bottomLeft !== null && revealSurroundingTiles(bottomLeft);
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

