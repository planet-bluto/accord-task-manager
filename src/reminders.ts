import moment from "moment"
import { Reminder } from "./models/reminder"
import { PlannerTask, ProjectTask, Task } from "./models/task"
import { PlannerTasks, ProjectTasks, Reminders } from "./persist"
import { CalendarDate_fromDate, CalendarDate_isEqual, ClockTime, ClockTime_fromDate, ClockTime_isEqual, DateTime_toTimestamp, InstanceRuleDay, InstanceRuleMonth, InstanceRuleSingle, InstanceRuleType, InstanceRuleWeek, InstanceRuleYear, ReminderType, Weekdays } from "./types"
import { Interval } from "./interval"

Interval.on("minute", reminderCheck)

function reminderCheck(thisMinute: number) {
  let date = CalendarDate_fromDate(new Date(thisMinute))
  let thisTime = ClockTime_fromDate(new Date(thisMinute))

  let _queuedReminders = new Set()
  let queueReminder = (task) => _queuedReminders.add(task)

  Reminders.value.forEach((reminder: Reminder) => {
    let task: Task = (PlannerTasks.value.find((task) => task.reminders.includes(reminder.id)) || ProjectTasks.value.find((task) => task.reminders.includes(reminder.id)))

    if (task == undefined) { Reminders.deleteEntry(reminder.id); return }

    switch (reminder.meta.type) {
      case ReminderType.ONCE:
        if (reminder.meta.time == thisMinute) {
          queueReminder(task)
        }
      break;
      case ReminderType.RELATIVE:
        let task_start: ClockTime = (task.type == "planner" ? ((task as PlannerTask).onDate(date) || (task as PlannerTask)).time_start : ClockTime_fromDate(new Date())) // latter is not possible bro
        let task_end: ClockTime = (task.type == "planner" ? ((task as PlannerTask).onDate(date) || (task as PlannerTask)).time_due : (task as ProjectTask).due)
        let based_time = (reminder.meta.base == "start" ? task_start : task_end)

        let diff = (reminder.meta.hours * 3600000 + reminder.meta.minutes * 60000 + reminder.meta.days * 86400000) * (reminder.meta.position == "before" ? 1 : -1)

        let newMinute = (thisMinute + diff)
        let newDate = CalendarDate_fromDate(new Date(newMinute))

        if (task.isOnDate(newDate)) {
          let diffedTime = ClockTime_fromDate(moment(Object.assign(date, based_time)).subtract(diff, 'milliseconds').toDate())
          print(task.title, diffedTime)
          
          if (ClockTime_isEqual(diffedTime, thisTime)) {
            queueReminder(task)
          }
        }
      break;
    }
  })

  Array.from(_queuedReminders).every(fireReminder)
}


function fireReminder(task: Task) {
  print(`Firing Reminder for ${task.title}`)
}

// debugging
declare global {
  var reminderCheck: (thisMinute: number) => void;
  interface Window { reminderCheck: (thisMinute: number) => void; }
}

window.reminderCheck = reminderCheck

export {}