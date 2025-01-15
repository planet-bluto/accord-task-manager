<script setup lang="ts">
import { Ref, ref } from 'vue';
import { Schedule } from '../../models/schedule';
import { Schedules } from '../../persist';
import ListSchedule from '../ListSchedule.vue';

import ContextMenu from 'primevue/contextmenu';
import { MenuItem } from "primevue/menuitem";
import { openSchedulePopup } from '../../popups/new_schedule';

const focusedSchedule: Ref<Schedule | null> = ref(null)

const menu = ref();
const items_base: MenuItem[] = [
    { label: 'Edit', command: () => {
      openSchedulePopup(focusedSchedule.value)
    }},
    { label: 'Clone' },
    { label: 'Delete', command: () => {
      Schedules.deleteEntry(focusedSchedule.value.id)
    }},
]
const items: Ref<MenuItem[]> = ref(items_base);
function openContextMenu(event: MouseEvent, schedule: Schedule) {
  // print(menu)
  focusedSchedule.value = schedule
  menu.value.show(event)
}

</script>

<template>
<div>
  <ContextMenu ref="menu" :model="items" />
  <div class="schedule-view">
    <ListSchedule v-for="schedule in Schedules.value" :schedule="(schedule as Schedule)" @contextmenu="event => openContextMenu(event, schedule)"></ListSchedule>
  </div>
</div>
</template>

<style scoped>
.schedule-view {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
