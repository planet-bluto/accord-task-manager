<script setup lang="ts">
const props = defineProps<{
    text: string;
}>()
</script>

<template>
  <div class="list-task-bean">
    <p>{{ props.text }}</p>
  </div>
  </template>
  
  <style scoped>
  .list-task-bean {
    background-color: var(--theme-back-3);
    border-radius: 30px;
    color: var(--theme-text-0);
    font-size: 28px;
    padding-left: 15px;
    padding-right: 15px;
    width: calc(250px - 30px);
  }
  </style>