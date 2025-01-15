import moment from "moment";
import { HeaderPopupElement, TextPopupInput, ClockTimePopupInput, DurationPopupInput, MultiPopupInput, CardPopupInput, CalendarDatePopupInput, NumberPopupInput, MultiSelectPopupInput, WeekPopupInput, SelectPopupInput, DateTimePopupInput, SubmitPopupButton, CheckboxPopupInput, PopupDriver } from "../popups";
import { InstanceRuleType, Weekdays, ReminderType } from "../types";
import { Schedule, ScheduleStatic } from "../models/schedule";

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
    elements.push([new CheckboxPopupInput("Invert Rule", "inverse", false)])
    return (() => elements)
}

export const NewSchedulePopup = () => [
    [new HeaderPopupElement("New Schedule")],
    [new TextPopupInput("Title", "title")],
    [new MultiPopupInput("Rules", "rules", [], () => ({
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
    }))],
    [new SubmitPopupButton()],
]

export function openSchedulePopup(schedule: Schedule = null) {
  let input_schedule = schedule
  let {html_elems, inputs} = PopupDriver.open(NewSchedulePopup(), input_schedule, async (data: ScheduleStatic) => {
    let new_schedule = new Schedule(data)
  })
}