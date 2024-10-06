import { Task } from "../models/task"
import {PopupDriver, HeaderPopupElement, NumberPopupInput, TextPopupInput, SubmitPopupButton, DateTimePopupInput, RepeatsPopupInput, ClockTimePopupInput, DurationPopupInput, MultiPopupInput, CardPopupInput, CalendarDatePopupInput} from "../popups"
import { InstanceRuleType, Weekdays } from "../types"

const _ = null // best

export var NewTaskPopup = [
    [new HeaderPopupElement("New Task")],
    [new TextPopupInput("Title", "title")],
    [new ClockTimePopupInput("Start Time", "time_start"), new DurationPopupInput("Task Duration", "duration"), new ClockTimePopupInput("Due Time", "time_due")],
    [new MultiPopupInput("Cards", "cards", [], {
        "_": {label: "Once", input: new CardPopupInput(_, _, _, [
            [new DateTimePopupInput("Date & Time", "date_time")],
            [new CalendarDatePopupInput("Date", "date")],
        ])},
    })],
    [new SubmitPopupButton()],
]

// export var NewTaskPopup = [
//     [new HeaderPopupElement("New Task")],
//     [new TextPopupInput("Title", "title")],
//     [new ClockTimePopupInput("Start Time", "time_start"), new DurationPopupInput("Task Duration", "duration"), new ClockTimePopupInput("Due Time", "time_due")],
//     [new MultiPopupInput("Assignment Rules", "rules", [], {
//         [InstanceRuleType.SINGLE]: {label: "Once", input: new CardPopupInput(_, _, _, [
//             [new DateTimePopupInput("Date & Time", "date")],
//         ])},
//         [InstanceRuleType.DAY]: {label: "by Day", input: new CardPopupInput(_, _, _, [
//             [new DatePopupInput("Starting on...", "from")],
//             [new NumberPopupInput("Every...", "every", 1, 1)],
//         ])},
//         [InstanceRuleType.WEEK]: {label: "by Week", input: new CardPopupInput(_, _, _, [
//             [new MultiSelectPopupInput("Weekdays", "weekdays", _, Weekdays)],
//             [new NumberPopupInput("Every...", "every", 1, 1)],
//         ])},
//         [InstanceRuleType.MONTH]: {label: "by Month", input: new CardPopupInput(_, _, _, [
//             [new NumberPopupInput("Day", "day", 1, 1, 31)],
//             [new NumberPopupInput("Every...", "every", 1, 1)],
//         ])},
//         [InstanceRuleType.YEAR]: {label: "by Year", input: new CardPopupInput(_, _, _, [
//             [new NumberPopupInput("Month", "month", 1, 1, 12)],
//             [new NumberPopupInput("Day", "day", 1, 1, 31)],
//             [new NumberPopupInput("Every...", "every", 1, 1)],
//         ])},
//     })],
//     [new MultiPopupInput("Reminders", "reminders", [], {
//         "relative": {
//             label: "Relative",
//             input: new CardPopupInput(_, _, _, [ // <=- The uuh uhm... Input the same way a popup yeah it's like a mini one inside of a a yeah you yeah yup
//                 [new NumberPopupInput("Minutes", "minutes", 0, 0)],
//                 [new NumberPopupInput("Hours", "hours", 0, 0)],
//                 [new NumberPopupInput("Days", "days", 0, 0)],
//                 [new SelectPopupInput("When", "when", "Before", ["Before", "After"])],
//                 [new SelectPopupInput("From", "from", "Start", ["Start", "Due"])],
//             ])
//         },
//         "exact": {
//             label: "Exact",
//             input: new CardPopupInput(_, _, _, [ // <=- The uuh uhm... Input the same way a popup yeah it's like a mini one inside of a a yeah you yeah yup
//                 [new ClockTimePopupInput("Time", "time")],
//             ])
//         },
//     })],
//     [new MultiPopupInput("Sub-Tasks", "sub_tasks", [], {
//         "_": {label: "Default", input: new TextPopupInput(_,_)}
//     })],
//     [new SubmitPopupButton()],
// ]

// Okay make some shit called a mini prompt or a card or something and you can just make objects from that
// new MultiPopupInput("Reminders", "reminders", [], {
//     "relative": {
//         label: "Relative",
//         input: new CardPopupInput(_, _, _, [ // <=- The uuh uhm... Input the same way a popup yeah it's like a mini one inside of a a yeah you yeah yup
//             [new NumberPopupInput("Minutes", "minutes", 0, 0)],
//             [new NumberPopupInput("Hours", "hours", 0, 0)],
//             [new NumberPopupInput("Days", "days", 0, 0)],
//             [new DropDownPopupInput("When", "when", "Before", ["Before", "After"])],
//             [new DropDownPopupInput("From", "from", "Start", ["Start", "Due"])],
//         ])
//     },
//     "exact": {
//         label: "Exact",
//         input: new CardPopupInput(_, _, _, [ // <=- The uuh uhm... Input the same way a popup yeah it's like a mini one inside of a a yeah you yeah yup
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
//         "_": new RelativeReminderPopupInput(_,_, ["start", "due"])
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
//         "Relative": new RelativeReminderPopupInput(_,_, ["due"])
//         "Exact": new ExactReminderPopupInput(_,_)
//     })],
//     [new TextPopupInput("Link", "link")],
//     [new MultiPopupInput("Tags", "tags", {
//         "_": new TagPopupInput(_,_) 
//     })],
//     [new SubmitPopupButton()],
// ]

export interface NewTaskResult extends Task {}