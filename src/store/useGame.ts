import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { GameStatus } from "@/types";
import useTimer from "@/composables/useTimer";
import useMineSet from "@/composables/useMineSet";

type GameLevel = "easy" | "normal" | "hard" | "extraHard";
type GameLevelMap = Record<GameLevel, { mineCounts: number; panelSize: number; label: string }>;

export const useGameStore = defineStore("game", () => {
    const { timeInSeconds, isPaused, toggle: timerToggle, restart: timerRestart, reset: timerReset } = useTimer({ secondsPadStart: 3 });
    const gameTotalMineCount = ref(0);
    const gamePanelSize = ref(0);
    const gameLevel = ref<GameLevel | null>(null);
    const { mineSets, panelSize, hasInitialized, initMineSets } = useMineSet({ totalMineCount: gameTotalMineCount, panelSize: gamePanelSize });

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
        gameTotalMineCount.value = 0;
        gamePanelSize.value = 0;
    }
    function setupGame(level: GameLevel) {
        gameLevel.value = level;
        const { mineCounts, panelSize } = gameLevelMap.value[level];
        gameTotalMineCount.value = mineCounts;
        gamePanelSize.value = panelSize;
        timerReset();
        initMineSets();
    }

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

    const currentGameLevel = computed(() => {
        if (gameLevel.value === null) return null;
        return gameLevelMap.value[gameLevel.value];
    });

    return {
        status,
        timeInSeconds,
        isTimerPaused: isPaused,

        hasInitialized,
        mineSets,
        panelSize,
        gameLevelMap,
        gameLevelOptions,
        currentGameLevel,

        startGame,
        toggleGame,
        resetGame,
        setupGame,
    };
});

