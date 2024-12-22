<script setup lang="ts">
import { Task } from '../models/task';

import ReminderBean from './ReminderBean.vue';

const props = defineProps<{
    task: Task;
}>()
</script>

<template>
<div class="list-task">
  <div class="list-task-left">
    <div class="list-task-left-top">
      <p class="list-task-title">{{ task.title }}</p>
    </div>
    <div class="list-task-left-bottom">
      <ReminderBean v-for="(reminderId) in task.reminders" :reminderId="reminderId" :task="task"></ReminderBean>
    </div>
  </div>
  <div class="list-task-right"></div>
</div>
</template>

<style scoped>
.list-task {
  display: flex;
  background: var(--theme-back-2);
  border-radius: 15px;
  width: calc(100% - 30px);
  min-height: 100px;
  max-height: 100px;
  padding: 15px;
  gap: 15px;
  opacity: 0.8;
  transition-property: opacity;
  transition-duration: 100ms;
}

.list-task:hover {
  opacity: 1;
}

.list-task-left {
  width: calc(100% - 100px - 15px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.list-task-left-bottom {
  display: flex;
  gap: 8px;
}

.list-task-right {
  width: 100px;
  height: 100%;
}

.list-task-title {
  font-size: 35px;
  font-weight: bold;
  color: var(--theme-text-0);
}
</style>