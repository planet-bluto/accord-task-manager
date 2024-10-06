import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, Optional, Sequelize, CreationOptional } from "sequelize-browser"
import fug from "sequelize-browser"
import { ClockTime, InstanceRule, TaskOverride, TaskStatus } from "../types"

export class Task {
    declare icon?: string; // null-ey
    declare title: string; // Required property on creation
    declare duration: number;
    declare reminders: CreationOptional<ForeignKey<string>[]>;
    declare sub_tasks: CreationOptional<ForeignKey<string>[]>;
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
        declare icon?: string; // null-ey
        declare title: string; // Required property on creation
        declare duration: number;
        declare reminders: CreationOptional<ForeignKey<string>[]>;
        declare sub_tasks: CreationOptional<ForeignKey<string>[]>;
        declare link: CreationOptional<string>;
        declare status: CreationOptional<TaskStatus>;

        declare time_start: ClockTime;
        declare time_due: ClockTime;
        declare rules: CreationOptional<InstanceRule[]>; // Default property
        declare overrides: CreationOptional<TaskOverride[]>; // Default property
    }

export class ProjectTask 
    extends fug.Model<
        fug.InferAttributes<ProjectTask>,
        fug.InferCreationAttributes<ProjectTask>
    > 
    implements Task 
    {
    declare icon?: string; // null-ey
    declare title: string; // Required property on creation
    declare duration: number;
    declare reminders: CreationOptional<ForeignKey<string>[]>;
    declare sub_tasks: CreationOptional<ForeignKey<string>[]>;
    declare link: CreationOptional<string>;
    declare status: CreationOptional<TaskStatus>;

    declare projectId: ForeignKey<string>;
    declare due: ClockTime;
}

export default (sequelize: Sequelize) => {
    PlannerTask.init({
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