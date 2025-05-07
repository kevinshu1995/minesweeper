import { ref, computed } from "vue";
import { createTimer } from "animejs";
import { millisecondsToSeconds } from "date-fns";

const DEFAULT_PAUSE_STATE = true;

type TimerOptions = {
    secondsPadStart?: number;
};

export default function useTimer(options: TimerOptions) {
    const time = ref(0);
    const timeInMilliseconds = computed(() => time.value);
    const timeInSeconds = computed(() => String(millisecondsToSeconds(time.value)).padStart(options.secondsPadStart ?? 0, "0"));

    const isPaused = ref(DEFAULT_PAUSE_STATE);

    const timer = createTimer({
        autoplay: !DEFAULT_PAUSE_STATE,
        onUpdate: self => {
            time.value = self.currentTime;
            isPaused.value = timer.paused;
        },
        onPause() {
            isPaused.value = timer.paused;
        },
    });

    const _resume = () => timer.resume();
    const _pause = () => timer.pause();

    const restart = () => timer.restart();

    const reset = () => {
        timer.pause();
        timer.seek(0);
        time.value = 0;
    };

    function toggle() {
        if (isPaused.value) {
            _resume();
        } else {
            _pause();
        }
    }

    return {
        time,
        timeInMilliseconds,
        timeInSeconds,
        isPaused,
        toggle,
        restart,
        reset,
    };
}

