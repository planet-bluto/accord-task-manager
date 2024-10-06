import moment from "moment"

//// MISC. ////
export const Weekdays = (["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const)
type _Weekdays = (typeof Weekdays)
export type Weekday = _Weekdays[number]

export interface CalendarDate {
    day: number,
    month: number,
    year: number
}
export function CalendarDate_toString(date: CalendarDate): string {
    return `${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}-${date.year}`
}
export function CalendarDate_fromString(str: string): CalendarDate {
    let bits: string[] = str.split("-")

    let year = Number(bits[0])
    let month = Number(bits[1])
    let day = Number(bits[2])

    return ({month, day, year} as CalendarDate)
}
export function CalendarDate_fromDate(date: Date): CalendarDate {
    return CalendarDate_fromString(moment(date).format("YYYY-MM-DD"))
}

export interface ClockTime {
    hour: number,
    minute: number
}
export function ClockTime_toString(time: ClockTime): string {
    return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`
}
export function ClockTime_fromString(str: string): ClockTime {
    let bits: string[] = str.split(":")

    let hour = Number(bits[0])
    let minute = Number(bits[1])

    return ({hour, minute} as ClockTime)
}
export function ClockTime_fromDate(date: Date): ClockTime {
    return ClockTime_fromString(moment(date).format("HH:mm"))
}



//// TASK ////
export enum TaskType {
    PLANNER,
    PROJECT
}

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