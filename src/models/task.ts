import { CalendarDate, CalendarDate_isEqual, CalendarDate_toString, ClockTime, DateTime, InstanceModiferType, InstanceModifier, InstanceModifierManual, InstanceModifierSchedule, InstanceRule, InstanceRuleDay, InstanceRuleMonth, InstanceRuleSingle, InstanceRuleType, InstanceRuleWeek, InstanceRuleYear, ReminderMetaOnce, ReminderMetaRelative, ReminderMetaTime, SubTask, TaskStatus, TaskStatuses, Weekdays } from '../types';
import moment from "moment";
import { PlannerTasks, ProjectTasks, Schedules } from '../persist';
import { Snowflake } from '@sapphire/snowflake';
import { ruleOnDate } from '../rules';
import { Schedule } from './schedule';
import { Reminder } from './reminder';
const snowflake = new Snowflake(SNOWFLAKE_EPOCH);

export interface TaskStatic {
    id?: string;
    type: "planner" | "project";
    icon?: string; // null-ey
    title: string; // Required property on creation
    duration: number;
    reminders?: (ReminderMetaRelative | ReminderMetaTime | ReminderMetaOnce)[];
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
    reminders?: (ReminderMetaRelative | ReminderMetaTime | ReminderMetaOnce)[];
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
    modifiers: InstanceModifier[]; // Default property
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
        modifiers: InstanceModifier[]; // Default property

        constructor(obj: PlannerTaskStatic, notNew = false) {
            super(obj)
            this["type"] = "planner"
            Object.assign(this, obj)
            if (!notNew) {
                PlannerTasks.push(this)
            }
        }

        onDate(date: CalendarDate) {
            let decidingRule = ruleOnDate(this.rules, date).rule

            let modifierIndex = ruleOnDate((this.modifiers || []).map((modifier) => ((modifier as InstanceModifierManual).rule || (modifier as InstanceModifierSchedule).schedule)), date).index
            let decidingModifier = (modifierIndex != null ? this.modifiers[modifierIndex] : null)

            // print(modifierIndex, decidingModifier, this.modifiers)

            if (decidingRule == null) { return undefined }

            let datedTask: PlannerTaskDated = {
                type: 'planner',
                id: this.id,
                icon: this.icon,
                title: this.title,

                time_start: (decidingModifier?.time_start || this.time_start),
                time_due: (decidingModifier?.time_due || this.time_due),
                duration: (decidingModifier?.duration || this.duration),

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
            let cloned_date2 = JSON.parse(JSON.stringify(date))
            let obj2 = Object.assign(cloned_date, this.onDate(cloned_date).time_start)
            let datedTaskStartMoment = moment(obj2)

            if ([COMPLETED, FAILED, SKIPPED].includes(status)) {
                return 'DONE'
            } else if (datedTaskDueMoment.isBefore(moment())) {
                return 'OVERDUE'
            } else if (datedTaskStartMoment.isBefore(moment())) {
                return 'TODO'
            } else {
                return 'NONE'
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