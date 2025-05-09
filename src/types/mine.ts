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

/** @description 單一格子的座標 */
export type SingleMineBoxAxis = {
    /** @description 座標 x (from 0) */
    x: number;
    /** @description 座標 y (from 0) */
    y: number;
    /** @description 附近格子的 index (from 0) */
    surroundBoxesIndex: SurroundBoxesIndex;
};

export type SingleMineBox = {
    axis: SingleMineBoxAxis;
    /** @description 此格的 index 值 (x + y) */
    index: number;
    /** @description 此格的顯示的狀態（被使用者看到的狀態） */
    state: RevealType | FlagType;
    /** @description 此格是否是地雷 */
    isMine: boolean;
    /** @description 此格是否已被揭露 */
    isRevealed: boolean;
    /** @description 此格被使用者標記的狀態 */
    flagType: FlagType;
    /** @description 此格揭露的狀態 */
    revealType: RevealType;
    /** @description 取得此格的狀態（沒有 side effect） */
    getBoxType: GetBoxType;
    /** @description 揭露此格（更新 revealType) */
    updateBoxType: UpdateBoxType;
    /** @description 改變此格的使用者標記的狀態（更新 flagType) */
    updateFlagType: UpdateFlagType;
};

