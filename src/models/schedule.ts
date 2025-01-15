import { Snowflake } from '@sapphire/snowflake';
import { Schedules } from '../persist';
import { CalendarDate, InstanceRule } from '../types';
import { ruleOnDate } from '../rules';
const snowflake = new Snowflake(SNOWFLAKE_EPOCH);

export interface ScheduleStatic {
    id?: string;
    title: string;
    rules: InstanceRule[]
}

export class Schedule implements ScheduleStatic {
  id: string;
  title: string;
  rules: InstanceRule[];

  constructor(obj: ScheduleStatic) {
    let just_created = false
    if (obj.id == null) { obj.id = String(snowflake.generate()); just_created = true }
    Object.assign(this, obj)
    if (just_created) { Schedules.push(this) }
  }

  isOnDate(date: CalendarDate) {
    let decidingRule = ruleOnDate(this.rules, date).rule
    // return (decidingRule != null && (!decidingRule.inverse))
    return (decidingRule != null)
  }
}