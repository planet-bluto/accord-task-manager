<script setup lang="ts">
const props = defineProps<{
    label: String,
    func: Function,
}>()
</script>

<template>
<div class="sidebar-button" @click="props.func()">
<p class="sidebar-header">{{ props.label }}</p>
</div>
</template>

<style scoped>
.sidebar-button {
    width: calc(100% - 40px);
    height: calc(80px - 40px);
    background-color: var(--theme-back-2);
    border-radius: 20px;
    padding: 20px;
    vertical-align: middle;
    display: flex;
    align-items: center;
}

.sidebar-header {
    font-family: "MontserratBold";
    font-size: 30px;
    margin: 0px;
}
</style>
