import { defineConfig } from "unocss";
import presetWind4 from "@unocss/preset-wind4";

export default defineConfig({
    presets: [presetWind4()],
    theme: {
        animation: {
            keyframes: {
                contentShow: "{ 0% {opacity: 0;transform:scale(0)} 100% {opacity: 1;transform:scale(1)} }",
                overlayShow: "{ 0% {opacity: 0;} 100% {opacity: 1;} }",
                contentClose: "{ 0% {opacity: 1;transform:scale(1)} 100% {opacity: 0;transform:scale(0)} }",
                overlayClose: "{ 0% {opacity: 0;} 100% {opacity: 1;} }",
            },
            durations: {
                contentShow: "0.3s",
                overlayShow: "0.3s",
                contentClose: "0.3s",
                overlayClose: "0.3s",
            },
            timingFns: {
                contentShow: "cubic-bezier(0.87, 0, 0.13, 1)",
                overlayShow: "cubic-bezier(0.87, 0, 0.13, 1)",
                contentClose: "cubic-bezier(0.87, 0, 0.13, 1)",
                overlayClose: "cubic-bezier(0.87, 0, 0.13, 1)",
            },
            counts: {
                contentShow: "both",
                overlayShow: "both",
                contentClose: "both",
                overlayClose: "both",
            },
        },
    },
});

