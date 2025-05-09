import { defineStore } from "pinia";
import { ref, computed } from "vue";

type DevInfoContentArray = {
    title: string;
    content: string | DevInfoContentArray;
}[];

type DevInfo = {
    [key: string]: string | { [key: string]: string };
};

export const useDevInfoStore = defineStore("devInfo", () => {
    const devInfo = ref<DevInfo>({
        version: "1.0.0",
        buildTime: new Date().toLocaleString(),
        test: {
            test1: "test1",
            test2: "test2",
        },
    });

    const devInfoContentArray = computed<DevInfoContentArray>(() => {
        const rawObject = devInfo.value;
        return Object.entries(rawObject).map(([key, value]) => {
            if (typeof value === "object") {
                return {
                    title: key,
                    content: Object.entries(value).map(([k, v]) => {
                        return {
                            title: k,
                            content: v,
                        };
                    }),
                };
            }
            return {
                title: key,
                content: value,
            };
        });
    });

    function updateDevInfo(key: string, value: string | { [key: string]: string }) {
        let clone = JSON.parse(JSON.stringify(devInfo.value));
        if (typeof value === "object") {
            const existingValue = typeof clone[key] === "object" ? clone[key] : {};
            clone[key] = { ...existingValue, ...value };
        } else {
            clone[key] = value;
        }
        devInfo.value = clone;
    }

    return { devInfoContentArray, updateDevInfo };
});

