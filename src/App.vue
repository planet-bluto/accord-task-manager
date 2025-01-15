<script setup lang="ts">
import Header from "./components/Header.vue"
import Sidebar from "./components/Sidebar.vue"

import TaskListView from "./components/views/TaskList.vue"
import PlannerView from "./components/views/Planner.vue"
import FocusSessionView from "./components/views/FocusSession.vue"
import SchedulesView from "./components/views/SchedulesView.vue"

import Popups from "./components/Popups.vue"

import {Router, Views} from "./router"
import { CalendarDate_fromDate } from "./types"

Router.switch_to_date(CalendarDate_fromDate(new Date()))
</script>

<template>
  <Popups></Popups>
  <Sidebar></Sidebar>

  <div id="right">
    <Header></Header>

    <div id="main">
      <!-- Views -->
      <TaskListView v-show="Router.current.value == Views.TASKS"></TaskListView>
      <PlannerView v-show="Router.current.value == Views.PLANNER"></PlannerView>
      <FocusSessionView v-show="Router.current.value == Views.FOCUS"></FocusSessionView>
      <SchedulesView v-show="Router.current.value == Views.SCHEDULES"></SchedulesView>
    </div>
  </div>
</template>

<style scoped>
#right {
  width: calc(100% - (var(--sidebar-width) + var(--gap)));
  /* width: 100%; */
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}

#main {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>