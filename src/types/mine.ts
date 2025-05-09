/** @description mine: 炸彈 | null:尚未揭示 | number: 附近八格有幾個炸彈 */
export type RevealType = "mine" | null | number;

/** @description flag: 標記炸彈 | question: 疑問 | null: 尚未標記 */
export type FlagType = "flag" | "question" | null;

export type UpdateBoxTypeReturn = {
    ok: true;
    type: RevealType;
};

export type UpdateFlagTypeReturn =
    | {
          ok: true;
          type: FlagType;
      }
    | {
          ok: false;
      };

export type GetBoxType = () => RevealType;

export type UpdateBoxType = () => UpdateBoxTypeReturn;
export type UpdateFlagType = () => UpdateFlagTypeReturn;

export type SurroundBoxesIndex = {
    right: number | null;
    left: number | null;
    top: number | null;
    bottom: number | null;
    topRight: number | null;
    topLeft: number | null;
    bottomRight: number | null;
    bottomLeft: number | null;
};

export type MineGrid = {
    axis: {
        x: number;
        y: number;
        index: number;
        surroundBoxesIndex: SurroundBoxesIndex;
    };
    isMine: boolean;
    isRevealed: boolean;
    flagType: FlagType;
    revealType: RevealType;
    getBoxType: GetBoxType;
    updateBoxType: UpdateBoxType;
    updateFlagType: UpdateFlagType;
}[][];

export type SingleMineBoxAxis = {
    x: number;
    y: number;
    surroundBoxesIndex: SurroundBoxesIndex;
};

export type SingleMineBox = {
    axis: SingleMineBoxAxis;
    index: number;
    state: RevealType | FlagType;
    isMine: boolean;
    isRevealed: boolean;
    flagType: FlagType;
    revealType: RevealType;
    getBoxType: GetBoxType;
    updateBoxType: UpdateBoxType;
    updateFlagType: UpdateFlagType;
};

