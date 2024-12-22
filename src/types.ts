import moment from "moment"

//// MISC. ////
export const Weekdays: string[] = (["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const)
type _Weekdays = (typeof Weekdays)
export type Weekday = _Weekdays[number]

export interface CalendarDate {
    day: number,
    month: number,
    year: number
}
export function CalendarDate_toString(date: CalendarDate): string {
    return `${date.year}-${String(date.month+1).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`
}
export function CalendarDate_fromString(str: string): CalendarDate {
    let bits: string[] = str.split("-")

    let year = Number(bits[0])
    let month = Number(bits[1])-1
    let day = Number(bits[2])

    return ({month, day, year} as CalendarDate)
}
export function CalendarDate_fromDate(date: Date): CalendarDate {
    return CalendarDate_fromString(moment(date).format("YYYY-MM-DD"))
}
export function CalendarDate_isEqual(dateA: CalendarDate, dateB: CalendarDate): boolean {
    return (CalendarDate_toString(dateA) == CalendarDate_toString(dateB))
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

export interface DateTime {
    day: number,
    month: number,
    year: number,
    hour: number,
    minute: number
}

export interface CalendarWeek {
    week: number,
    year: number
}
export function CalendarWeek_toString(week: CalendarWeek): string {
    return `${week.year}-W${week.week}`
}
export function CalendarWeek_fromString(str: string): CalendarWeek {
    let bits = str.split("-")
    let year = Number(bits.shift())
    let week = Number(bits.shift()?.slice(1))


    return {week, year}
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

export interface SubTask {
    icon: string,
    title: string,
    duration: number,
    done: boolean
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
    every: number, // 1 == Everyday, 2 == Every Other, etc.
    from: CalendarDate // "Starting On" Date
}
// WEEK
export interface InstanceRuleWeek extends InstanceRule {
    type: InstanceRuleType.WEEK,
    weekdays: Weekday[],
    every: number, // 1 == Every Week, 2 == Every Other, etc.
    from: CalendarWeek // "Starting On" Week
}
// MONTH
export interface InstanceRuleMonth extends InstanceRule {
    type: InstanceRuleType.MONTH,
    day: number,
    every: number, // 1 == Every Month, 2 == Every Other, etc.
    from: { // "Starting On" Month
        month: number,
        year: number
    }
}
// YEAR
export interface InstanceRuleYear extends InstanceRule {
    type: InstanceRuleType.YEAR,
    month: number,
    day: number,
    every: number, // 1 == Every Year, 2 == Every Other, etc.
    from: number // "Starting On" Year
}



//// REMINDER... is a schema 💔 ////
export interface ReminderMeta {
    type: ReminderType;
}

export interface ReminderMetaRelative extends ReminderMeta {
    type: ReminderType.RELATIVE;
    base: "start" | "due";
    position: "before" | "after";
    minutes: number;
    hours: number;
    days: number;
}

export interface ReminderMetaTime extends ReminderMeta {
    type: ReminderType.TIME;
    days: number;
    time: ClockTime;
}

export interface ReminderMetaOnce extends ReminderMeta {
    type: ReminderType.ONCE;
    time: DateTime;
}

export enum ReminderType {
    RELATIVE,
    ONCE,
    TIME,
    LOCATION
}



//// CalendarElement ////
export interface CalendarElementDateObject {
    today: boolean,
    date: number,
    month: number,
    year: number
    thisMonth: boolean,
    calendar_date: CalendarDate
}