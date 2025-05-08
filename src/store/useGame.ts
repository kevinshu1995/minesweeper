import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { GameStatus } from "@/types";
import useTimer from "@/composables/useTimer";
import useMineSet from "@/composables/useMineSet";

export const useGameStore = defineStore("game", () => {
    const { timeInSeconds, isPaused, toggle: timerToggle, restart: timerRestart, reset: timerReset } = useTimer({ secondsPadStart: 3 });
    const gameMineCounts = ref(0);
    const gamePanelSize = ref(0);
    const { mineSets, gridSize, hasInitialized, initMineGrid } = useMineSet({ mineCounts: gameMineCounts, panelSize: gamePanelSize });

    const gameStatus = ref<GameStatus>("idle");
    const status = computed(() => gameStatus.value);

    function startGame() {
        timerRestart();
    }
    function toggleGame() {
        timerToggle();
    }
    function resetGame() {
        timerReset();
        gameStatus.value = "idle";
        gameMineCounts.value = 0;
        gamePanelSize.value = 0;
    }
    function setupGame(level: GameLevel) {
        const { mineCounts, panelSize } = gameLevelMap.value[level];
        gameMineCounts.value = mineCounts;
        gamePanelSize.value = panelSize;
        timerReset();
        initMineGrid();
    }

    type GameLevel = "easy" | "normal" | "hard" | "extraHard";
    type GameLevelMap = Record<GameLevel, { mineCounts: number; panelSize: number; label: string }>;

    const gameLevelMap = computed<GameLevelMap>(() => ({
        easy: {
            label: "Easy",
            mineCounts: 10,
            panelSize: 10,
        },
        normal: {
            label: "Medium",
            mineCounts: 40,
            panelSize: 16,
        },
        hard: {
            label: "Hard",
            mineCounts: 99,
            panelSize: 30,
        },
        extraHard: {
            label: "Extra Hard",
            mineCounts: 200,
            panelSize: 50,
        },
    }));

    const gameLevelOptions = computed(() => {
        const keys = Object.keys(gameLevelMap.value) as GameLevel[];
        return keys.map(key => ({
            value: key,
            label: gameLevelMap.value[key].label,
        }));
    });

    return {
        status,
        timeInSeconds,
        isTimerPaused: isPaused,

        hasInitialized,
        mineSets,
        gridSize,
        gameLevelMap,
        gameLevelOptions,

        startGame,
        toggleGame,
        resetGame,
        setupGame,
    };
});

