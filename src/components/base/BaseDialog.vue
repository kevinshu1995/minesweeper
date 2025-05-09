<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot } from "reka-ui";

const open = defineModel<boolean>({ default: false });

defineProps<{
    disableEscapeOnClickOutside?: boolean;
    closeBtn?: boolean;
    maxWidth?: string;
}>();

function close() {
    open.value = false;
}
</script>

<template>
    <DialogRoot v-model:open="open">
        <DialogPortal>
            <DialogOverlay class="bg-black/10 backdrop-blur data-[state=open]:animate-overlayShow data-[state=open]:animate-overlayClose fixed inset-0 z-10" data-dialog-overlay />
            <DialogContent
                class="data-[state=open]:animate-contentShow data-[state=closed]:animate-contentClose fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-8 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-0 z-11"
                :style="{
                    maxWidth: maxWidth || '450px',
                }"
                @interact-outside="event => {
                    if ((disableEscapeOnClickOutside) === false) return
                    const target = event.target as HTMLElement;
                    if (target?.closest('[data-dialog-overlay]')) return event.preventDefault()
                }"
            >
                <slot :open="open" :close="close" />
                <DialogClose
                    class="text-neutral-900 hover:bg-neutral-200 focus:shadow-neutral-700 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-0 cursor-pointer"
                    aria-label="Close"
                    v-if="closeBtn"
                >
                    <Icon icon="lucide:x" />
                </DialogClose>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>

