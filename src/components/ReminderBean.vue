<script setup lang="ts">
import { Task } from '../models/task';
import moment from 'moment';

const props = defineProps<{
    reminder: object;
    task: Task;
}>()

let timestamp = Date.now() + (((1000 * 60) * 60) * 5)

</script>

<template>
<div class="reminder-bean">
  <p>{{ moment(timestamp).fromNow() }}</p>
</div>
</template>

<style scoped>
.reminder-bean {
  background-color: var(--theme-back-3);
  border-radius: 30px;
  color: var(--theme-text-0);
  font-size: 28px;
  padding-left: 15px;
  padding-right: 15px;
  width: calc(250px - 30px);
}
</style>
