<script setup>
const props = defineProps({
    disabled: {
        type:Boolean,
        default: false
    },
    title: {
        type: String,
        default: "Send"
    }
})
</script>

<template>
   <button 
    :disabled=disabled
    >{{title}}</button>
</template>