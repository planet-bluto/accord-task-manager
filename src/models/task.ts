import { CalendarDate, CalendarDate_isEqual, CalendarDate_toString, ClockTime, DateTime, InstanceRule, InstanceRuleDay, InstanceRuleMonth, InstanceRuleSingle, InstanceRuleType, InstanceRuleWeek, InstanceRuleYear, SubTask, TaskOverride, TaskStatus, TaskStatuses, Weekdays } from '../types';
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
    status?: {[date: string]: TaskStatus};
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
    status?: {[date: string]: TaskStatus};

    constructor(obj: (PlannerTaskStatic | ProjectTaskStatic)) {
        if (obj.id == null) { this.id = String(snowflake.generate()) }
    }

    isOnDate(_date: CalendarDate): boolean {
        return (this.onDate(_date) != undefined)
    }

    onDate(_date: CalendarDate): undefined | (PlannerTaskDated | ProjectTaskDated) {
        return undefined;
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

export interface PlannerTaskDated extends TaskStatic {
    type: "planner"

    time_start: ClockTime;
    time_due: ClockTime;
    // rules: InstanceRule[]; // Default property
    // overrides: TaskOverride[]; // Default property
}

export class PlannerTask extends Task implements PlannerTaskStatic {
        declare type: "planner";

        time_start: ClockTime;
        time_due: ClockTime;
        rules: InstanceRule[]; // Default property
        overrides: TaskOverride[]; // Default property

        constructor(obj: PlannerTaskStatic, notNew = false) {
            super(obj)
            this["type"] = "planner"
            Object.assign(this, obj)
            if (!notNew) {
                PlannerTasks.push(this)
            }
        }

        onDate(date: CalendarDate) {
            // let isIt = false
            let decidingRule = null

            for (let i = 0; i < this.rules.length; i++) {
                if (decidingRule) { break }

                let rule: InstanceRule = this.rules[i]

                function itIs() { decidingRule = rule }

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

            if (decidingRule == null) { return undefined }

            let datedTask: PlannerTaskDated = {
                type: 'planner',
                id: this.id,
                icon: this.icon,
                title: this.title,

                time_start: (decidingRule.time_start || this.time_start),
                time_due: (decidingRule.time_due || this.time_due),
                duration: (decidingRule.duration || this.duration),

                reminders: this.reminders,
                sub_tasks: this.sub_tasks,
                link: this.link,
                status: this.status
            }

            return datedTask
        }

        statusOnDate(date: CalendarDate) {
            return (this.status ? (this.status[CalendarDate_toString(date)] || TaskStatus.NOT_STARTED) : TaskStatus.NOT_STARTED)
        }

        stateOnDate(date: CalendarDate) {
            let status = this.statusOnDate(date)
            
            const {COMPLETED, FAILED, SKIPPED} = TaskStatus

            let cloned_date = JSON.parse(JSON.stringify(date))
            let obj = Object.assign(cloned_date, this.onDate(cloned_date).time_due)
            let datedTaskDueMoment = moment(obj)

            if ([COMPLETED, FAILED, SKIPPED].includes(status)) {
                return 'DONE'
            } else if (datedTaskDueMoment.isBefore(moment())) {
                return 'OVERDUE'
            } else {
                return 'TODO'
            }
        }
    }

export interface ProjectTaskStatic extends TaskStatic {
    type: "project";

    projectId: string;
    due: DateTime;
}

export interface ProjectTaskDated extends TaskStatic {
    type: "project"

    projectId: string;
    due: DateTime;
}

export class ProjectTask extends Task implements ProjectTaskStatic {
    declare type: "project";

    projectId: string;
    due: DateTime;

    constructor(obj: ProjectTaskStatic) {
        super(obj)
        this["type"] = "project"
        Object.assign(this, obj)
        ProjectTasks.push(this)
    }

    onDate(date: CalendarDate) {
        if (this.due.year == date.year && this.due.month == date.month && this.due.day == date.day) {
            return (this as ProjectTaskDated)
        } else {
            return undefined
        }
    }
}