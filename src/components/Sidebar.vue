<script setup lang="ts">
import moment from 'moment';

import SidebarButton from "./SidebarButton.vue"

import {Router, Views} from "../router"

</script>

<template>
<div id="sidebar">
    <h1 id="calendar-month-header">{{ moment().format("MMMM") }}</h1> 
    <SidebarButton label="TaskList" :func="() => { Router.switch(Views.TASKS); Router.set_header(`TaskListView`) }" />
    <SidebarButton label="Planner" :func="() => { Router.switch(Views.PLANNER); Router.set_header(`PlannerView`) }" />
    <SidebarButton label="FocusSession" :func="() => { Router.switch(Views.FOCUS); Router.set_header(`FocusView`) }" />
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
}
</style>
