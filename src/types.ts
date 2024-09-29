//// MISC. ////
export type Weekday = ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")

export interface CalendarDate {
    day: number,
    month: number,
    year: number
}
export interface ClockTime {
    hour: number,
    minute: number
}



//// TASK ////
export enum TaskStatus {
    NOT_STARTED,
    IN_PROGRESS,
    COMPLETED
}

export interface TaskOverride {
    date: CalendarDate,
    duration?: number,
    time_start?: ClockTime,
    time_due?: ClockTime
}



//// INSTANCE ////
export enum InstanceRuleType {
    SINGLE,
    DAY,
    WEEK,
    MONTH,
    YEAR,
}

export interface InstanceRule {
    type: InstanceRuleType,
    duration?: number,
    time_start?: ClockTime,
    time_due?: ClockTime
}
// SINGLE
export interface InstanceRuleSingle extends InstanceRule {
    type: InstanceRuleType.SINGLE,
    date: CalendarDate
}
// DAY
export interface InstanceRuleDay extends InstanceRule {
    type: InstanceRuleType.DAY,
    from: CalendarDate,
    every: number
}
// WEEK
export interface InstanceRuleWeek extends InstanceRule {
    type: InstanceRuleType.WEEK,
    weekdays: Weekday[],
    every: number
}
// MONTH
export interface InstanceRuleMonth extends InstanceRule {
    type: InstanceRuleType.MONTH,
    day: number,
    every: number
}
// YEAR
export interface InstanceRuleYear extends InstanceRule {
    type: InstanceRuleType.YEAR,
    month: number,
    day: number,
    every: number
}



//// REMINDER... is a schema 💔 ////
export enum ReminderType {
    TIME,
    LOCATION
}