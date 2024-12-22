import { ForeignKey, Sequelize, CreationOptional } from "sequelize-browser"
import fug from "sequelize-browser"
import { CalendarDate, CalendarDate_isEqual, ClockTime, DateTime, InstanceRule, InstanceRuleDay, InstanceRuleMonth, InstanceRuleSingle, InstanceRuleType, InstanceRuleWeek, InstanceRuleYear, SubTask, TaskOverride, TaskStatus, Weekdays } from '../types';
import moment from "moment";

export class Task {
    isOnDate(_date: CalendarDate) {
        throw new Error('Method not implemented.');
    }
    declare type: "planner" | "project";
    declare icon?: string; // null-ey
    declare title: string; // Required property on creation
    declare duration: number;
    declare reminders: CreationOptional<ForeignKey<string>[]>;
    declare sub_tasks: SubTask[];
    declare link: CreationOptional<string>;
    declare status: CreationOptional<TaskStatus>;
}

// new Task()

export class PlannerTask 
    extends fug.Model<
        fug.InferAttributes<PlannerTask>,
        fug.InferCreationAttributes<PlannerTask>
    > 
    implements Task 
    {
        declare type: "planner";
        declare icon?: string; // null-ey
        declare title: string; // Required property on creation
        declare duration: number;
        declare reminders: CreationOptional<ForeignKey<string>[]>;
        declare sub_tasks: SubTask[];
        declare link: CreationOptional<string>;
        declare status: CreationOptional<TaskStatus>;

        declare time_start: ClockTime;
        declare time_due: ClockTime;
        declare rules: CreationOptional<InstanceRule[]>; // Default property
        declare overrides: CreationOptional<TaskOverride[]>; // Default property

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

export class ProjectTask 
    extends fug.Model<
        fug.InferAttributes<ProjectTask>,
        fug.InferCreationAttributes<ProjectTask>
    > 
    implements Task 
    {
    declare type: "project";
    declare icon?: string; // null-ey
    declare title: string; // Required property on creation
    declare duration: number;
    declare reminders: CreationOptional<ForeignKey<string>[]>;
    declare sub_tasks: SubTask[];
    declare link: CreationOptional<string>;
    declare status: CreationOptional<TaskStatus>;

    declare projectId: ForeignKey<string>;
    declare due: DateTime;

    isOnDate(date: CalendarDate) {
        return (this.due.year == date.year && this.due.month == date.month && this.due.day == date.day)
    }
}

export default (sequelize: Sequelize) => {
    PlannerTask.init({
        type: {
            type: fug.DataTypes.STRING,
            defaultValue: "planner",
            allowNull: true
        },
        icon: {
            type: fug.DataTypes.STRING,
            allowNull: true
        },
        title: {
            type: fug.DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: fug.DataTypes.INTEGER,
            allowNull: false
        },
        reminders: {
            type: fug.DataTypes.JSON,
            defaultValue: [],
            allowNull: false
        },
        sub_tasks: {
            type: fug.DataTypes.JSON,
            defaultValue: [],
            allowNull: false
        },
        link: {
            type: fug.DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: fug.DataTypes.INTEGER,
            defaultValue: TaskStatus.NOT_STARTED,
            allowNull: false
        },
        time_start: {
            type: fug.DataTypes.JSON,
            allowNull: false
        },
        time_due: {
            type: fug.DataTypes.JSON,
            allowNull: false
        },
        rules: {
            type: fug.DataTypes.JSON,
            defaultValue: [],
            allowNull: false
        },
        overrides: {
            type: fug.DataTypes.JSON,
            defaultValue: [],
            allowNull: false
        }
    }, {sequelize})

    ProjectTask.init({
        type: {
            type: fug.DataTypes.STRING,
            defaultValue: "project",
            allowNull: true
        },
        icon: {
            type: fug.DataTypes.STRING,
            allowNull: true
        },
        title: {
            type: fug.DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: fug.DataTypes.INTEGER,
            allowNull: false
        },
        reminders: {
            type: fug.DataTypes.JSON,
            defaultValue: [],
            allowNull: false
        },
        sub_tasks: {
            type: fug.DataTypes.JSON,
            defaultValue: [],
            allowNull: false
        },
        link: {
            type: fug.DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: fug.DataTypes.INTEGER,
            allowNull: false
        },
        projectId: {
            type: fug.DataTypes.UUID,
            allowNull: false
        },
        due: {
            type: fug.DataTypes.JSON,
            allowNull: false
        }
    }, {sequelize})
}