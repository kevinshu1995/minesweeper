<template>
    <SelectRoot v-model="selectValue">
        <SelectTrigger
            :class="[
                width || 'min-w-40 w-full',
                'inline-flex items-center justify-between rounded-xl py-3 px-4 leading-0 gap-1 bg-white text-[#6F826A] hover:bg-stone-50 border shadow-sm data-[placeholder]:text-gray-500 outline-0 cursor-pointer',
            ]"
        >
            <SelectValue :placeholder="placeholder" />
            <Icon icon="radix-icons:chevron-down" class="h-3.5 w-3.5" />
        </SelectTrigger>

        <SelectPortal>
            <SelectContent class="min-w-[160px] bg-white rounded-lg border shadow-sm will-change-[opacity,transform] z-[100]">
                <SelectViewport class="p-[5px]">
                    <SelectGroup>
                        <SelectItem
                            v-for="(option, index) in options"
                            :key="index"
                            class="leading-0 text-gray-600 py-4 hover:bg-[#6F826A] hover:text-white rounded-[3px] flex items-center h-6 pr-9 pl-6 relative select-none data-[disabled]:text-gray data-[disabled]:pointer-events-none data-[highlighted]:outline-0 data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-800 outline-0 cursor-pointer transition-all"
                            :value="option.value"
                            :disabled="option.disabled"
                        >
                            <SelectItemIndicator class="absolute left-0 w-6 inline-flex items-center justify-center">
                                <Icon icon="radix-icons:check" />
                            </SelectItemIndicator>
                            <SelectItemText>
                                {{ option.label }}
                            </SelectItemText>
                        </SelectItem>
                    </SelectGroup>
                </SelectViewport>
            </SelectContent>
        </SelectPortal>
    </SelectRoot>
</template>

<script setup lang="ts">
import { SelectContent, SelectGroup, SelectItem, SelectItemIndicator, SelectItemText, SelectPortal, SelectRoot, SelectTrigger, SelectValue, SelectViewport } from "reka-ui";
import { Icon } from "@iconify/vue";

type Option = {
    label: string;
    value: string;
    disabled?: boolean;
};

defineProps<{
    placeholder?: string;
    options: Option[];
    width?: string;
}>();

const selectValue = defineModel<Option["value"]>();
</script>

