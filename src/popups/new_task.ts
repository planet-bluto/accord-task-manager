import moment from "moment"
import { Task } from "../models/task"
import {HeaderPopupElement, NumberPopupInput, TextPopupInput, SubmitPopupButton, DateTimePopupInput, RepeatsPopupInput, ClockTimePopupInput, DurationPopupInput, MultiPopupInput, CardPopupInput, CalendarDatePopupInput, SelectPopupInput, MultiSelectPopupInput, WeekPopupInput} from "../popups"
import { InstanceRuleType, ReminderType, Weekdays } from "../types"

const _ = null // best

const MonthSelectPopupTemplate = {
    "January": 0,
    "February": 1,
    "March": 2,
    "April": 3,
    "May": 4,
    "June": 5,
    "July": 6,
    "August": 7,
    "October": 8,
    "September": 9,
    "November": 10,
    "December": 11,
}

export const NewTaskPopup = () => [
    [new HeaderPopupElement("New Task")],
    [new TextPopupInput("Title", "title")],
    [new ClockTimePopupInput("Start Time", "time_start"), new DurationPopupInput("Task Duration", "duration"), new ClockTimePopupInput("Due Time", "time_due")],
    [new MultiPopupInput("Rules", "rules", [], {
        [InstanceRuleType.SINGLE]: {label: "Once", input: (() => new CardPopupInput(_, _, _, (() => [
            [new HeaderPopupElement("Once")],
            [new CalendarDatePopupInput("Date", "date")],
        ])))},
        [InstanceRuleType.DAY]: {label: "Days", input: () => new CardPopupInput(_, _, _, () => [
            [new HeaderPopupElement("Daily")],
            [new CalendarDatePopupInput("Starting on", "from")],
            [new NumberPopupInput("Every", "every", 1, 1)],
        ])},
        [InstanceRuleType.WEEK]: {label: "Week", input: () => new CardPopupInput(_, _, _, () => [
            [new HeaderPopupElement("Weekly")],
            [new MultiSelectPopupInput("", "weekdays", Weekdays)],
            [new WeekPopupInput("Starting On", "from", {week: moment().week(), year: moment().year()})],
            [new NumberPopupInput("Every", "every", 1, 1)],
        ])},
        [InstanceRuleType.MONTH]: {label: "Month", input: () => new CardPopupInput(_, _, _, () => [
            [new HeaderPopupElement("Monthly")],
            [new NumberPopupInput("Day", "day", 1, 1, 31)],
            [new CardPopupInput("Starting On", "from", [], () => [
                [new SelectPopupInput("Month", "month", MonthSelectPopupTemplate, moment().month(), "number"), new NumberPopupInput("Year", "year", moment().year(), 1970, 3070)]
            ])],
            [new NumberPopupInput("Every", "every", 1, 1)],
        ])},
        [InstanceRuleType.YEAR]: {label: "Year", input: () => new CardPopupInput(_, _, _, () => [
            [new HeaderPopupElement("Yearly")],
            [new SelectPopupInput("Month", "month", MonthSelectPopupTemplate, moment().month(), "number"), new NumberPopupInput("Day", "day", moment().day(), 1, 31)],
            [new NumberPopupInput("Starting On", "from", moment().year(), 1970, 3070)],
            [new NumberPopupInput("Every", "every", 1, 1)],
        ])},
    })],
    [new MultiPopupInput("Reminders", "reminders", [], {
        [ReminderType.ONCE]: {label: "Once", input: () => new CardPopupInput(_, _, _, () => [ // ReminderTimeExact
            [new DateTimePopupInput("Date & Time", "time")],
        ])},
        [ReminderType.RELATIVE]: {label: "Relative", input: () => new CardPopupInput(_, _, _, () => [ // ReminderTimeRelative
            [new NumberPopupInput("Days", "days", 0), new NumberPopupInput("Hour", "hours", 0), new NumberPopupInput("Minutes", "minutes", 0)],
            [new SelectPopupInput(null, "position", {Before: "before", After: "after"}), new SelectPopupInput(null, "base", {Start: "start", Due: "due"})],
        ])},
        [ReminderType.TIME]: {label: "Relative at Time", input: () => new CardPopupInput(_, _, _, () => [ // ReminderTimeRelativeAtTime
            [new NumberPopupInput("Days", "days", 0), new SelectPopupInput("⠀", "position", ["before", "after"])],
            [new ClockTimePopupInput("At", "time")],
        ])},
    })],
    [new TextPopupInput("Link", "link")],
    [new SubmitPopupButton()],
]

// export var NewTaskPopup = [
//     [new HeaderPopupElement("New Task")],
//     [new TextPopupInput("Title", "title")],
//     [new ClockTimePopupInput("Start Time", "time_start"), new DurationPopupInput("Task Duration", "duration"), new ClockTimePopupInput("Due Time", "time_due")],
//     [new MultiPopupInput("Assignment Rules", "rules", [], {
//         [InstanceRuleType.SINGLE]: {label: "Once", input: () => new CardPopupInput(_, _, _, () => [
//             [new DateTimePopupInput("Date & Time", "date")],
//         ])},
//         [InstanceRuleType.DAY]: {label: "by Day", input: () => new CardPopupInput(_, _, _, () => [
//             [new DatePopupInput("Starting on...", "from")],
//             [new NumberPopupInput("Every...", "every", 1, 1)],
//         ])},
//         [InstanceRuleType.WEEK]: {label: "by Week", input: () => new CardPopupInput(_, _, _, () => [
//             [new MultiSelectPopupInput("Weekdays", "weekdays", _, Weekdays)],
//             [new NumberPopupInput("Every...", "every", 1, 1)],
//         ])},
//         [InstanceRuleType.MONTH]: {label: "by Month", input: () => new CardPopupInput(_, _, _, () => [
//             [new NumberPopupInput("Day", "day", 1, 1, 31)],
//             [new NumberPopupInput("Every...", "every", 1, 1)],
//         ])},
//         [InstanceRuleType.YEAR]: {label: "by Year", input: () => new CardPopupInput(_, _, _, () => [
//             [new NumberPopupInput("Month", "month", 1, 1, 12)],
//             [new NumberPopupInput("Day", "day", 1, 1, 31)],
//             [new NumberPopupInput("Every...", "every", 1, 1)],
//         ])},
//     })],
//     [new MultiPopupInput("Reminders", "reminders", [], {
//         "relative": {
//             label: "Relative",
//             input: () => new CardPopupInput(_, _, _, () => [ // <=- The uuh uhm... Input the same way a popup yeah it's like a mini one inside of a a yeah you yeah yup
//                 [new NumberPopupInput("Minutes", "minutes", 0, 0)],
//                 [new NumberPopupInput("Hours", "hours", 0, 0)],
//                 [new NumberPopupInput("Days", "days", 0, 0)],
//                 [new SelectPopupInput("When", "when", "Before", ["Before", "After"])],
//                 [new SelectPopupInput("From", "from", "Start", ["Start", "Due"])],
//             ])
//         },
//         "exact": {
//             label: "Exact",
//             input: () => new CardPopupInput(_, _, _, () => [ // <=- The uuh uhm... Input the same way a popup yeah it's like a mini one inside of a a yeah you yeah yup
//                 [new ClockTimePopupInput("Time", "time")],
//             ])
//         },
//     })],
//     [new MultiPopupInput("Sub-Tasks", "sub_tasks", [], {
//         "_": {label: "Default", input: () => new TextPopupInput(_,_)}
//     })],
//     [new SubmitPopupButton()],
// ]

// Okay make some shit called a mini prompt or a card or something and you can just make objects from that
// new MultiPopupInput("Reminders", "reminders", [], {
//     "relative": {
//         label: "Relative",
//         input: () => new CardPopupInput(_, _, _, () => [ // <=- The uuh uhm... Input the same way a popup yeah it's like a mini one inside of a a yeah you yeah yup
//             [new NumberPopupInput("Minutes", "minutes", 0, 0)],
//             [new NumberPopupInput("Hours", "hours", 0, 0)],
//             [new NumberPopupInput("Days", "days", 0, 0)],
//             [new DropDownPopupInput("When", "when", "Before", ["Before", "After"])],
//             [new DropDownPopupInput("From", "from", "Start", ["Start", "Due"])],
//         ])
//     },
//     "exact": {
//         label: "Exact",
//         input: () => new CardPopupInput(_, _, _, () => [ // <=- The uuh uhm... Input the same way a popup yeah it's like a mini one inside of a a yeah you yeah yup
//             [new ClockTimePopupInput("Time", "time")],
//         ])
//     },
// })

// var IdealPlannerTaskPopup = [
//     [new HeaderPopupElement("New Task")],
//     [new TextPopupInput("Title", "title")],
//     [new ClockTimePopupInput("Start Time", "time_start"), new DurationPopupInput("Task Duration", "duration"), new ClockTimePopupInput("Due Time", "time_due")],
//     [new MultiPopupInput("Assignment Rules", "rules", {
//         "Once": new TaskRuleOncePopupInput(_, _), // InstanceRuleOnce
//         "by Day": new TaskRuleDayPopupInput(_, _), // InstanceRuleDay
//         "by Week": new TaskRuleWeekPopupInput(_, _), // InstanceRuleWeek
//         "by Month": new TaskRuleMonthPopupInput(_, _), // InstanceRuleMonth
//         "by Year": new TaskRuleYearPopupInput(_, _), // InstanceRuleYear
//     })],
//     [new MultiPopupInput("Sub-Tasks", "sub_tasks", {
//         "_": new TextPopupInput(_,_) // <= Select input that returns a taskID- wait a minute, it'd be better to list the parent task on all the sub-tasks... nah wait sub tasks are like- a new thing... so they return a got damnb string??
//     })],
//     [new MultiPopupInput("Reminders", "reminders", {
//         "_": new RelativeReminderPopupInput(_,_, () => ["start", "due"])
//     })],
//     [new TextPopupInput("Link", "link")],
//     [new MultiPopupInput("Tags", "tags", {
//         "_": new TagPopupInput(_,_) 
//     })],
//     [new SubmitPopupButton()],
// ]

// var IdealProjectTaskPopup = [
//     [new ProjectPopupInput("Project", "project")],
//     [new HeaderPopupElement("New Task")],
//     [new TextPopupInput("Title", "title")],
//     [new DurationPopupInput("Task Duration", "duration"), new DateTimePopupInput("Due Date", "due")],
//     [new MultiPopupInput("Sub-Tasks", "sub_tasks", {
//         "_": new TextPopupInput(_,_) // <= Select input that returns a taskID- wait a minute, it'd be better to list the parent task on all the sub-tasks... nah wait sub tasks are like- a new thing... so they return a got damnb string??
//     })],
//     [new MultiPopupInput("Reminders", "reminders", {
//         "Relative": new RelativeReminderPopupInput(_,_, () => ["due"])
//         "Exact": new ExactReminderPopupInput(_,_)
//     })],
//     [new TextPopupInput("Link", "link")],
//     [new MultiPopupInput("Tags", "tags", {
//         "_": new TagPopupInput(_,_) 
//     })],
//     [new SubmitPopupButton()],
// ]

export interface NewTaskResult extends Task {}