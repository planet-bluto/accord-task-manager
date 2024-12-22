import { CalendarDate, CalendarDate_isEqual, ClockTime, DateTime, InstanceRule, InstanceRuleDay, InstanceRuleMonth, InstanceRuleSingle, InstanceRuleType, InstanceRuleWeek, InstanceRuleYear, SubTask, TaskOverride, TaskStatus, Weekdays } from '../types';
import moment from "moment";
import { PlannerTasks, ProjectTasks } from '../persist';
import { Snowflake } from '@sapphire/snowflake';
const snowflake = new Snowflake(SNOWFLAKE_EPOCH);

export interface TaskStatic {
    id?: string;
    type: "planner" | "project";
    icon?: string; // null-ey
    title: string; // Required property on creation
    duration: number;
    reminders?: string[];
    sub_tasks: SubTask[];
    link?: string;
    status?: TaskStatus;
}

export class Task implements TaskStatic {
    id: string;
    type: "planner" | "project";
    icon?: string; // null-ey
    title: string; // Required property on creation
    duration: number;
    reminders?: string[];
    sub_tasks: SubTask[];
    link?: string;
    status?: TaskStatus;

    constructor(obj: (PlannerTaskStatic | ProjectTaskStatic)) {
        if (obj.id == null) { this.id = String(snowflake.generate()) }
    }

    isOnDate(_date: CalendarDate) {
        throw new Error('Method not implemented.');
    }
}

// new Task()

export interface PlannerTaskStatic extends TaskStatic {
    type: "planner";

    time_start: ClockTime;
    time_due: ClockTime;
    rules: InstanceRule[]; // Default property
    overrides: TaskOverride[]; // Default property
}

export class PlannerTask extends Task implements PlannerTaskStatic {
        declare type: "planner";

        time_start: ClockTime;
        time_due: ClockTime;
        rules: InstanceRule[]; // Default property
        overrides: TaskOverride[]; // Default property

        constructor(obj: PlannerTaskStatic) {
            super(obj)
            Object.assign(this, obj)
            PlannerTasks.push(this)
        }

        isOnDate(date: CalendarDate) {
            let isIt = false

            for (let i = 0; i < this.rules.length; i++) {
                if (isIt) { break }

                let rule: InstanceRule = this.rules[i]

                function itIs() { isIt = true }

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
            }

            return isIt
        }
    }

export interface ProjectTaskStatic extends TaskStatic {
    type: "project";

    projectId: string;
    due: DateTime;
}

export class ProjectTask extends Task implements ProjectTaskStatic {
    declare type: "project";

    projectId: string;
    due: DateTime;

    constructor(obj: ProjectTaskStatic) {
        super(obj)
        Object.assign(this, obj)
        ProjectTasks.push(this)
    }

    isOnDate(date: CalendarDate) {
        return (this.due.year == date.year && this.due.month == date.month && this.due.day == date.day)
    }
}