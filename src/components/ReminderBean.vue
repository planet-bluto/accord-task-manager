<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { PlannerTask, ProjectTask, Task } from '../models/task';
import moment from 'moment';
import { Reminder } from '../models/reminder';
import { ClockTime, ClockTime_fromDate, ReminderMeta, ReminderMetaOnce, ReminderMetaRelative, ReminderMetaTime, ReminderType } from '../types';
import { FocusedDate, Reminders } from '../persist';

const props = defineProps<{
    reminderId: string;
    task: Task;
}>()

const timestamp: ComputedRef<number> = computed(() => {
  let returnStamp = Date.now()

  let reminder: Reminder = Reminders.value.find(reminder => reminder.id == props.reminderId)
  if (reminder == undefined) { return Date.now() }
  print("Reminder: ", reminder)

  if (reminder.meta.type == ReminderType.ONCE) {
    print("One time one time...")
    let actual_reminder = reminder.meta as ReminderMetaOnce
    return moment(actual_reminder.time).valueOf()
  }
  if (reminder.meta.type == ReminderType.RELATIVE) {
    let task_start: ClockTime = (props.task.type == "planner" ? (props.task as PlannerTask).time_start : ClockTime_fromDate(new Date())) // latter is not possible bro
    let task_end: ClockTime = (props.task.type == "planner" ? (props.task as PlannerTask).time_due : (props.task as ProjectTask).due)

    let actual_reminder = reminder.meta as ReminderMetaRelative
    let momentObj = {...FocusedDate.value}
    print((actual_reminder.base == "start" ? task_start : task_end))
    Object.assign(momentObj, (actual_reminder.base == "start" ? task_start : task_end))

    let dateMoment = moment(momentObj)
    print(momentObj)
    
    let theKeys: ("minutes" | "hours" | "days")[] = ["minutes", "hours", "days"]
    theKeys.forEach((key: "minutes" | "hours" | "days") => {
      dateMoment[actual_reminder.position == "before" ? "subtract" : "add"](actual_reminder[key], key)
    })

    return dateMoment.valueOf()
  }
  if (reminder.meta.type == ReminderType.TIME) {
    // let actual_reminder = reminder.meta as ReminderMetaTime
    return Date.now() + (((1000 * 60) * 60) * 5)
  }

  return returnStamp
})



</script>

<template>
<div class="reminder-bean">
  <p :title="moment(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')">{{ moment(timestamp).fromNow() }}</p>
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
