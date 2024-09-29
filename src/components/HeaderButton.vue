<script setup lang="ts">
const props = defineProps<{
    id: String,
    icon: String,
    func: Function,
}>()
</script>

<template>
<div :id="`header-${props.id}-button`" class="header-button" @click="props.func()">
    <img :src="`./icons/${props.icon}.svg`" alt="settings" />
</div>
</template>

<style scoped>
.header-button {
    width: 80px;
    height: 80px;
}

.header-button > img {
    width: 100%;
    height: 100%;
}
</style>
