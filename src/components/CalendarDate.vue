<script setup lang="ts">
import { Router } from '../router';
import { CalendarElementDateObject, CalendarDate_isEqual } from '../types';
import { FocusedDate } from '../persist';

const props = defineProps<{
    entry: CalendarElementDateObject;
}>()
</script>

<template>
<div @click="Router.switch_to_date(props.entry.calendar_date)" class="calender-date" :focused="CalendarDate_isEqual(FocusedDate, props.entry.calendar_date)" :today="props.entry.today" :thisMonth="props.entry.thisMonth">{{ props.entry.date }}</div>
</template>

<style scoped>
.calender-date {
  background-color: var(--theme-back-3);
  border-radius: 5px;
  font-weight: bolder;
  align-content: center;
  text-align: center;
}

.calender-date[focused="true"] {
  border: solid var(--theme-accent-3) 3px;
}

.calender-date[today="true"] {
  background: var(--theme-accent-1)
}

.calender-date[thisMonth="false"] {
  opacity: 0.25;
}
</style>
