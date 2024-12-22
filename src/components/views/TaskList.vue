<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { Task } from "../../models/task";
import ListTask from "../ListTask.vue"
import { PlannerTasks, TaskListFilters } from "../../persist";

// let tasks = ref([]);


// // figure out when to load these...
// PlannerTask?.findAll().then(foundTasks => {
//   tasks.value = foundTasks
// })

const TaskListTasks: ComputedRef<Task[]> = computed(() => {
  return PlannerTasks.value.filter(task => {
    return TaskListFilters.value.every(filter => filter(task))
  })
})

</script>

<template>
<div class="task-list">
  <ListTask v-for="(task) in TaskListTasks" :task="task"></ListTask>
</div>
</template>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: calc(100% - 15px);
  height: 100%;
  padding-right: 15px;
}
</style>
