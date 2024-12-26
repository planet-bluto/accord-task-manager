<script setup lang="ts">
import moment from 'moment';
import { Ref, ref } from 'vue';

import CalendarDate from "./CalendarDate.vue"
import { CalendarElementDateObject } from '../types';
import { currMonth, currYear } from '../persist';

moment.updateLocale('en', {
    week : { dow : 0 }
})

var dates: Ref<CalendarElementDateObject[]> = ref([])

function setMonth(month_idx: number, year: number) {
  // print("month_idx: ", month_idx)
  // print("year: ", year)

  let today = moment().format("MM/DD/YYYY")

  let monthDate = moment().date(1).month(month_idx).year(year)
  // print("monthDate: ", monthDate.format("MM/DD/YYYY"))

  let currMonthDayCount = monthDate.endOf("month").date()
  // print("currMonthDayCount: ", currMonthDayCount)

  let prevMonthDayCount = monthDate.subtract(1, "month").endOf("month").date()
  // print("prevMonthDayCount: ", prevMonthDayCount)

  let currMonthStartingWeekDay = monthDate.weekday()
  // print("currMonthStartingWeekDay: ", currMonthStartingWeekDay)

  let i = 0
  let iDate = monthDate.clone()
  iDate.subtract(currMonthStartingWeekDay, "day")
  dates.value = []
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 7; x++) {
      let entry: CalendarElementDateObject = {
        today: (iDate.format("MM/DD/YYYY") == today),
        date: iDate.date(),
        month: iDate.month(),
        year: iDate.year(),
        thisMonth: (iDate.month() == month_idx),
        calendar_date: {month: iDate.month(), day: iDate.date(), year: iDate.year()}
      }
      dates.value.push(entry)

      // print(`[${x}, ${y}] `, entry)
      i++
      iDate.add(1, "day")
    }
  }
}

function addMonth(val) {
  let newMoment = moment({
    month: currMonth.value,
    year: currYear.value
  }).add(val, "month")

  currMonth.value = newMoment.get("month")
  currYear.value = newMoment.get("year")

  setMonth(currMonth.value, currYear.value)
}

setMonth(currMonth.value, currYear.value)

function calendarScroll(e) { (e.deltaY > 0 ? addMonth(1) : addMonth(-1)) }
</script>

<template>
<div id="calendar" @wheel="calendarScroll">
  <div id="calender-top"></div>
  <div id="calender-bottom">
    <CalendarDate v-for="(date) in dates" :entry="date"></CalendarDate>
  </div>
</div>
</template>

<style scoped>
#calendar {
  width: 100%;
  height: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

#calender-top {
  background-color: var(--theme-back-2);
  height: 50px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

#calender-bottom {
  background-color: var(--theme-back-2);
  width: calc(100% - (8px * 2));
  height: calc(100% - 50px - 12px - (8px * 2));
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  padding: 8px;
  gap: 8px;
}
</style>
