<template>
    <button
        :class="[
            padding || 'py-3 px-4',
            background || 'bg-[#BF9264]',
            color || 'text-white',
            fontSize || 'text-5',
            'rounded-xl',
            'hover:bg-opacity-95 hover:scale-102',
            'outline-0 border-none transition-all cursor-pointer',
            'disabled:bg-opacity-50 disabled:cursor-not-allowed disabled:scale-100',
        ]"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
defineProps<{
    padding?: string;
    background?: string;
    color?: string;
    fontSize?: string;
}>();
</script>

