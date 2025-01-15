import moment from "moment"
import { InstanceRule, InstanceRuleType, InstanceRuleSingle, CalendarDate_isEqual, InstanceRuleWeek, Weekdays, InstanceRuleDay, InstanceRuleMonth, InstanceRuleYear, CalendarDate, InstanceRuleSchedule } from './types';
import { Schedules } from "./persist";
import { Schedule } from "./models/schedule";

export function ruleOnDate(entries: (InstanceRule | string)[], date: CalendarDate): {rule: (InstanceRule | string) | null, index: number | null} {
  let decidingRule = null
  let index = 0

  for (index = 0; index < entries.length; index++) {
      if (decidingRule) { break }

      function itIs() { decidingRule = value }

      let value = entries[index]
      if (typeof value == "string") {
        let scheduleId: string = value
        let schedule: Schedule = Schedules.findEntry(scheduleId)

        if (schedule && schedule.isOnDate(date)) { itIs() }
      } else {
        let rule: InstanceRule = (value as InstanceRule)
        let dateMoment = moment(date)

        if (rule.type == InstanceRuleType.SINGLE) {
            let actual_rule: InstanceRuleSingle = (rule as InstanceRuleSingle)
            if (CalendarDate_isEqual(actual_rule.date, date)) { itIs() }
        }
        if (rule.type == InstanceRuleType.WEEK) {
            let actual_rule: InstanceRuleWeek = (rule as InstanceRuleWeek)
            let weekday = dateMoment.weekday()
            let weekMoment = dateMoment.clone().set({week: actual_rule.from.week, year: actual_rule.from.year, weekday: weekday})
            let weekDiff = (dateMoment.diff(weekMoment, 'week'))

            if (actual_rule.weekdays.includes(Weekdays[weekday])) {
                if ((weekDiff % actual_rule.every) == 0) { itIs() }
            }
        }
        if (rule.type == InstanceRuleType.DAY) {
            let actual_rule: InstanceRuleDay = (rule as InstanceRuleDay)
            if (((dateMoment.diff(moment(actual_rule.from), 'days')) % actual_rule.every) == 0) { itIs() }
        }
        if (rule.type == InstanceRuleType.MONTH) {
            let actual_rule: InstanceRuleMonth = (rule as InstanceRuleMonth)
            if (actual_rule.day == date.day) {
                if (((dateMoment.diff(moment(actual_rule.from), 'months')) % actual_rule.every) == 0) { itIs() }
            }
        }
        if (rule.type == InstanceRuleType.YEAR) {
            let actual_rule: InstanceRuleYear = (rule as InstanceRuleYear)
            if (actual_rule.month == date.month && actual_rule.day == date.day) {
                let yearMoment = dateMoment.clone().set({year: actual_rule.from})
                if (((dateMoment.diff(yearMoment, 'years')) % actual_rule.every) == 0) { itIs() }
            }
        }
        if (rule.type == InstanceRuleType.SCHEDULE) {
            let actual_rule: InstanceRuleSchedule = (rule as InstanceRuleSchedule)
            let schedule_id = String(actual_rule.schedule)
            let schedule_thingy = Schedules.findEntry(schedule_id)
            // print(`DICKHEAD [`, actual_rule.schedule, `]: `, schedule_thingy)
            print(Schedules)
            // let schedule: Schedule = new Schedule(schedule_thingy)
            if (ruleOnDate(schedule_thingy.rules, date)) { itIs() } // EZ??
        }
      }
  }

  return {rule: decidingRule, index: (decidingRule == null ? null : index-1)}
}