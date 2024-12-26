<script setup lang="ts">
import { provide, computed, ComputedRef, Component, Ref, ref } from "vue";
import { PlannerTask, Task } from "../../models/task";
import ListTask from "../ListTask.vue"
import { FocusedDate, PlannerTasks, TaskListFilters } from "../../persist";
import { HOUR, MINUTE } from "../../time";
import { CleanTaskStatuses, TaskStates, TaskStatus, TaskStatuses } from "../../types";

// let tasks = ref([]);


// // figure out when to load these...
// PlannerTask?.findAll().then(foundTasks => {
//   tasks.value = foundTasks
// })

const TaskListTasks: ComputedRef<Task[]> = computed(() => {
  let returnTasks = PlannerTasks.value.filter(task => {
    return TaskListFilters.value.every(filter => filter(task))
  })

  returnTasks.sort((a: PlannerTask, b: PlannerTask) => {
    let aStateIDX = TaskStates.indexOf(a.stateOnDate(FocusedDate.value))
    let bStateIDX = TaskStates.indexOf(b.stateOnDate(FocusedDate.value))

    if (aStateIDX != bStateIDX) {
      return aStateIDX - bStateIDX
    } else {
      let theseTaskStatuses = Object.values(CleanTaskStatuses)
      let aStatus: TaskStatus = theseTaskStatuses.indexOf(a.statusOnDate(FocusedDate.value))
      let bStatus: TaskStatus = theseTaskStatuses.indexOf(b.statusOnDate(FocusedDate.value))
      // print(aStatus, bStatus)
      if (aStatus != bStatus) {
        return (aStatus - bStatus)
      } else {
        let aVal = (a.onDate(FocusedDate.value).time_start.hour * HOUR) + (a.onDate(FocusedDate.value).time_start.minute * MINUTE)
        let bVal = (b.onDate(FocusedDate.value).time_start.hour * HOUR) + (b.onDate(FocusedDate.value).time_start.minute * MINUTE)
        return (aVal - bVal)
      }
    }
  })

  return returnTasks
})

const focusedListTask: Ref<null | HTMLDivElement> = ref(null)
provide('focusedListTask', focusedListTask)
</script>

<template>
<TransitionGroup class="task-list" name="list" tag="div">
  <ListTask v-for="(task) in TaskListTasks" :task="task" :key="task.id"></ListTask>
</TransitionGroup>
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

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
