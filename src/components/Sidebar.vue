<script setup lang="ts">
import moment from 'moment';

import SidebarButton from "./SidebarButton.vue"
import Calendar from "./Calendar.vue"
import { currMonth, currYear } from '../persist';

import {Router, Views} from "../router"
import { openSchedulePopup } from '../popups/new_schedule';

</script>

<template>
<div id="sidebar">
    <h1 id="calendar-month-header">{{ moment({month: currMonth, year: currYear}).format("MMMM, YYYY") }}</h1>
    <Calendar></Calendar>
    <!-- <SidebarButton label="TaskList" :func="() => { Router.switch(Views.TASKS, `TaskListView`) }" /> -->
    <SidebarButton label="Planner" :func="() => { Router.switch(Views.PLANNER, `Planner`) }" />
    <SidebarButton label="Focus" :func="() => { Router.switch(Views.FOCUS, `Focus Session`) }" />
    <SidebarButton label="Projects" :func="() => { Router.switch(Views.FOCUS, `Projects`) }" />
    <SidebarButton label="Schedules" :func="() => { Router.switch(Views.SCHEDULES, `Schedules`, openSchedulePopup) }" />
</div>
</template>

<style scoped>
#sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    width: var(--sidebar-width);
    height: 100%;
}

#calendar-month-header {
    width: 100%;
    text-align: center;
    font-family: "MontserratBold";
}
</style>
