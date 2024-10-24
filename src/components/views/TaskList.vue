<script setup lang="ts">
import { ref } from "vue";
import { PlannerTask } from "../../models/task";
import ListTask from "../ListTask.vue"
import { PlannerTasks } from "../../persist";

// let tasks = ref([]);


// // figure out when to load these...
// PlannerTask?.findAll().then(foundTasks => {
//   tasks.value = foundTasks
// })

</script>

<template>
<div class="task-list">
  <ListTask v-for="(task) in PlannerTasks" :task="task"></ListTask>
</div>
</template>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 100%;
}
</style>
