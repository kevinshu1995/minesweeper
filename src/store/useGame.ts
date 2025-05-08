import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { GameStatus } from "@/types";
import useTimer from "@/composables/useTimer";

export const useGameStore = defineStore("game", () => {
    const { timeInSeconds, isPaused, toggle: timerToggle, restart: timerRestart, reset: timerReset } = useTimer({ secondsPadStart: 3 });

    const gameStatus = ref<GameStatus>("idle");
    const status = computed(() => gameStatus.value);

    const gameMines = ref(0);
    const gamePanelSize = ref(0);

    function startGame() {
        timerRestart();
    }
    function toggleGame() {
        timerToggle();
    }
    function resetGame() {
        timerReset();
        gameStatus.value = "idle";
        gameMines.value = 0;
        gamePanelSize.value = 0;
    }
    function setupGame() {
        timerReset();
    }

    // const gameLevelMap = computed(() => ({
    //     easy: {
    //         mineCounts: 10,
    //         panelSize: 10,
    //     },
    //     normal: {
    //         mineCounts: 40,
    //         panelSize: 16,
    //     },
    //     hard: {
    //         mineCounts: 99,
    //         panelSize: 30,
    //     },
    //     extraHard: {
    //         mineCounts: 200,
    //         panelSize: 50,
    //     },
    // }));

    return {
        status,
        timeInSeconds,
        isTimerPaused: isPaused,

        startGame,
        toggleGame,
        resetGame,
        setupGame,
    };
});

