import { toRef, ref, computed, type Ref } from "vue";
import type { FlagType, RevealType, UpdateFlagType, GetTileRevealType, UpdateTileRevealType, SingleMineTileAxis } from "@/types";

function useMineBoxUtils(panelSize: Ref<number>) {
    const calculateIndex = (yPos: number, xPos: number): number | null => {
        if (xPos < 0 || xPos >= panelSize.value || yPos < 0 || yPos >= panelSize.value) {
            return null;
        }
        return yPos * panelSize.value + xPos;
    };
    return { calculateIndex };
}

export default function useMineTile(x: number, y: number, refPanelSize: number, refMinesIndexArray: Ref<number[]>) {
    const minesIndexArray = toRef(refMinesIndexArray);
    const panelSize = toRef(refPanelSize);

    const index = computed(() => y * panelSize.value + x);
    const flagType = ref<FlagType>(null);
    const revealType = ref<RevealType>(null);

    const isRevealed = computed(() => revealType.value !== null);
    const isMine = computed(() => minesIndexArray.value.includes(index.value));

    const revealState = computed(() => {
        if (revealType.value !== null) return revealType.value;
        return flagType.value;
    });

    const { calculateIndex } = useMineBoxUtils(panelSize);

    const axis = computed<SingleMineTileAxis>(() => ({
        x,
        y,
        surroundTilesIndex: {
            right: calculateIndex(y, x + 1),
            left: calculateIndex(y, x - 1),
            top: calculateIndex(y - 1, x),
            bottom: calculateIndex(y + 1, x),
            topRight: calculateIndex(y - 1, x + 1),
            topLeft: calculateIndex(y - 1, x - 1),
            bottomRight: calculateIndex(y + 1, x + 1),
            bottomLeft: calculateIndex(y + 1, x - 1),
        },
    }));

    const getTileRevealType: GetTileRevealType = () => {
        if (isMine.value) {
            return "mine";
        }
        return Object.values(axis.value.surroundTilesIndex)
            .filter((index): index is number => index !== null)
            .filter(index => minesIndexArray.value.includes(index)).length;
    };

    const updateTileRevealType: UpdateTileRevealType = () => {
        const type = getTileRevealType();
        revealType.value = type;
        return {
            ok: true,
            type,
        };
    };

    const updateFlagType: UpdateFlagType = () => {
        if (isRevealed.value) {
            return {
                ok: false,
            };
        }

        const flagTransition: Record<string, FlagType> = {
            null: "flag",
            flag: "question",
            question: null,
        };

        // 使用目前旗標值作為鍵來取得下一個狀態
        const currentFlag = String(flagType.value);
        flagType.value = flagTransition[currentFlag];

        return {
            ok: true,
            type: flagType.value,
        };
    };

    return {
        axis,
        index,
        revealState,
        isMine,
        isRevealed,
        flagType,
        revealType,

        getTileRevealType,
        updateTileRevealType,
        updateFlagType,
    };
}

export type UseMineTileReturn = ReturnType<typeof useMineTile>;

