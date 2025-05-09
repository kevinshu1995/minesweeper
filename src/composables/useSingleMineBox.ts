import { toRef, ref, computed, type Ref } from "vue";
import type { FlagType, RevealType, UpdateFlagType, GetBoxType, UpdateBoxType, SingleMineBoxAxis } from "@/types";

export default function useMineBox(x: number, y: number, refPanelSize: number, refMinesIndexArray: Ref<number[]>) {
    const minesIndexArray = toRef(refMinesIndexArray, "value");
    const panelSize = toRef(refPanelSize);

    const index = computed(() => y * panelSize.value + x);
    const flagType = ref<FlagType>(null);
    const revealType = ref<RevealType>(null);

    const isRevealed = computed(() => revealType.value !== null);
    const isMine = computed(() => minesIndexArray.value.includes(index.value));

    const state = computed(() => {
        if (revealType.value !== null) return revealType.value;
        return flagType.value;
    });

    const axis = computed<SingleMineBoxAxis>(() => ({
        x,
        y,
        surroundBoxesIndex: {
            right: x + 1 > panelSize.value - 1 ? null : y * panelSize.value + (x + 1),
            left: x - 1 < 0 ? null : y * panelSize.value + (x - 1),
            top: y - 1 < 0 ? null : (y - 1) * panelSize.value + x,
            bottom: y + 1 > panelSize.value - 1 ? null : (y + 1) * panelSize.value + x,
            topRight: y - 1 < 0 || x + 1 > panelSize.value - 1 ? null : (y - 1) * panelSize.value + (x + 1),
            topLeft: y - 1 < 0 || x - 1 < 0 ? null : (y - 1) * panelSize.value + (x - 1),
            bottomRight: y + 1 > panelSize.value - 1 || x + 1 > panelSize.value - 1 ? null : (y + 1) * panelSize.value + (x + 1),
            bottomLeft: y + 1 > panelSize.value - 1 || x - 1 < 0 ? null : (y + 1) * panelSize.value + (x - 1),
        },
    }));

    const getBoxType: GetBoxType = () => {
        if (isMine.value) {
            return "mine";
        }
        return Object.values(axis.value.surroundBoxesIndex).reduce<number>((total, otherBoxIndex) => {
            if (otherBoxIndex !== null && minesIndexArray.value.includes(otherBoxIndex)) {
                return total + 1;
            }
            return total;
        }, 0);
    };

    const updateBoxType: UpdateBoxType = () => {
        const type = getBoxType();
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
        const types: FlagType[] = ["flag", "question", null];
        const currentFlagTypeIndex = types.findIndex(type => type === flagType.value);
        const nextFlagTypeIndex = (currentFlagTypeIndex + 1) % types.length;

        flagType.value = types[nextFlagTypeIndex];
        return {
            ok: true,
            type: flagType.value,
        };
    };

    return {
        axis,
        index,
        state,
        isMine,
        isRevealed,
        flagType,
        revealType,

        getBoxType,
        updateBoxType,
        updateFlagType,
    };
}

export type UseMineBoxReturn = ReturnType<typeof useMineBox>;

