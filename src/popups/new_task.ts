import moment from "moment"
import { PlannerTask, PlannerTaskStatic, Task } from "../models/task"
import {HeaderPopupElement, NumberPopupInput, TextPopupInput, SubmitPopupButton, DateTimePopupInput, RepeatsPopupInput, ClockTimePopupInput, DurationPopupInput, MultiPopupInput, CardPopupInput, CalendarDatePopupInput, SelectPopupInput, MultiSelectPopupInput, WeekPopupInput, PopupDriver, SubHeaderPopupElement, CheckboxPopupInput, TaskOverrideCheckboxPopupInput} from "../popups"
import { InstanceRuleType, ReminderMetaOnce, ReminderMetaRelative, ReminderMetaTime, ReminderType, Weekdays } from "../types"
import { Reminder } from "../models/reminder"
import { PlannerTasks, Reminders } from "../persist"

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

function instanceRuleMake(elements: any[]) {
    elements.push([new TaskOverrideCheckboxPopupInput("Time Override", "has_override")])
    // elements.push([new SubHeaderPopupElement("Time Override")])
    elements.push([new ClockTimePopupInput("Start Time", "time_start")])
    elements.push([new ClockTimePopupInput("Due Time", "time_due")])
    elements.push([new DurationPopupInput("Task Duration", "duration")])
    return (() => elements)
}

export const NewTaskPopup = () => [
    [new HeaderPopupElement("New Task")],
    [new TextPopupInput("Title", "title")],
    [new ClockTimePopupInput("Start Time", "time_start"), new DurationPopupInput("Task Duration", "duration"), new ClockTimePopupInput("Due Time", "time_due")],
    [new MultiPopupInput("Rules", "rules", [], {
        [InstanceRuleType.SINGLE]: {label: "Once", input: () => new CardPopupInput(_, _, _, instanceRuleMake([
            [new HeaderPopupElement("Once")],
            [new CalendarDatePopupInput("Date", "date")],
        ]))},
        [InstanceRuleType.DAY]: {label: "Days", input: () => new CardPopupInput(_, _, _, instanceRuleMake([
            [new HeaderPopupElement("Daily")],
            [new CalendarDatePopupInput("Starting on", "from")],
            [new NumberPopupInput("Every", "every", 1, 1)],
        ]))},
        [InstanceRuleType.WEEK]: {label: "Week", input: () => new CardPopupInput(_, _, _, instanceRuleMake([
            [new HeaderPopupElement("Weekly")],
            [new MultiSelectPopupInput("", "weekdays", Weekdays)],
            [new WeekPopupInput("Starting On", "from", {week: moment().week(), year: moment().year()})],
            [new NumberPopupInput("Every", "every", 1, 1)],
        ]))},
        [InstanceRuleType.MONTH]: {label: "Month", input: () => new CardPopupInput(_, _, _, instanceRuleMake([
            [new HeaderPopupElement("Monthly")],
            [new NumberPopupInput("Day", "day", 1, 1, 31)],
            [new CardPopupInput("Starting On", "from", [], () => [
                [new SelectPopupInput("Month", "month", MonthSelectPopupTemplate, moment().month(), "number"), new NumberPopupInput("Year", "year", moment().year(), 1970, 3070)]
            ])],
            [new NumberPopupInput("Every", "every", 1, 1)],
        ]))},
        [InstanceRuleType.YEAR]: {label: "Year", input: () => new CardPopupInput(_, _, _, instanceRuleMake([
            [new HeaderPopupElement("Yearly")],
            [new SelectPopupInput("Month", "month", MonthSelectPopupTemplate, moment().month(), "number"), new NumberPopupInput("Day", "day", moment().day(), 1, 31)],
            [new NumberPopupInput("Starting On", "from", moment().year(), 1970, 3070)],
            [new NumberPopupInput("Every", "every", 1, 1)],
        ]))},
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


// export var PoppedUpTask = null
export async function openPlannerTaskPopup(task: PlannerTask | null = null, newAnyway: boolean = false) {
    let input_task: any = JSON.parse(JSON.stringify(task))
    let cache_reminders: Reminder[] = []
    if (task != null) {
        let proms = input_task.reminders.map((reminder_id) => Reminders.findEntry(reminder_id))
        cache_reminders = await Promise.all(proms)
        input_task.reminders = cache_reminders.map((reminder) => {return JSON.parse(JSON.stringify(reminder.meta))})
        // PoppedUpTask

        input_task.rules = input_task.rules.map((rule) => {return Object.assign({has_override: (rule.time_start != undefined)}, rule)})
        print("THEMS THE RULES: ", input_task.rules)
    }

    let {html_elems, inputs} = PopupDriver.open(NewTaskPopup(), input_task, async (data: PlannerTaskStatic) => {
        if (!newAnyway) {
            cache_reminders.forEach(reminder => {
                Reminders.deleteEntry(reminder.id)
            })
        }
        
        if (PlannerTask == null) {return}

        let remindersToCreate = data.reminders
        data.reminders = []
        await remindersToCreate.awaitForEach(async (reminder_data: (ReminderMetaRelative | ReminderMetaTime | ReminderMetaOnce)) => {
            reminder_data.type = Number(reminder_data.type)
            // print(reminder_data)
            // let reminder = await Reminder.create({meta: reminder_data})
            let reminder = new Reminder({meta: reminder_data})
            data.reminders.push(reminder.id)
        })
        
        if (task == null || newAnyway) {
            // let thisTask = await PlannerTask.create(data)
            let thisTask = new PlannerTask(data)

            print("Created Task!", thisTask)
        } else {
            await PlannerTasks.updateEntry(task.id, new PlannerTask(data, true))

            print("Edited Task!", data)
        }
    })

    if (inputs != null) { // this is scuffed and ghetto and I hate it and I hate it and it's not right but it works.
        let startElem: HTMLInputElement = inputs["time_start"].children[1] as HTMLInputElement 
        let endElem: HTMLInputElement = inputs["time_due"].children[1] as HTMLInputElement
        let startChange = (e: Event) => {
            print(startElem.value)
            endElem.min = startElem.value
        }

        startElem.addEventListener("input", startChange)
        startElem.addEventListener("change", startChange)

        let endChange = (e: Event) => {
            print(endElem.value)
            startElem.max = endElem.value
        }

        endElem.addEventListener("input", endChange)
        endElem.addEventListener("change", endChange)


        // print(html_elems)
        // let task_override_boxes: HTMLInputElement[] = (html_elems.filter(elem => elem.hasAttribute("task_override_checkbox")) as HTMLInputElement[])
        // task_override_boxes.forEach(task_override_box => {

        // })
    }
}

export interface NewTaskResult extends Task {}