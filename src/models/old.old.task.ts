import { DataTypes, Model, Optional, Sequelize } from "sequelize-browser"
import fug from "sequelize-browser"
import { ClockTime, InstanceRule, TaskStatus } from "../types"

export interface TaskAttributes {
    id: string,
    icon: string,
    title: string,
    duration: string,
    time_start: ClockTime,
    time_due: ClockTime,
    rules: InstanceRule[],
    sub_tasks: string[],
    project: any,
    link: string,
    status: TaskStatus,
}

interface TaskCreationAttributes
    extends Optional<TaskAttributes, 'id'> {}

interface TaskInstance
    extends Model<TaskAttributes, TaskCreationAttributes>,
    TaskAttributes {
        createdAt?: Date;
        updatedAt?: Date;
    }

var test: TaskInstance

export var Task: TaskInstance | null;

export default (sequelize: Sequelize) => {
    let _Task = sequelize.define<TaskInstance>("Task", {
        id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: fug.DataTypes.UUID,
            unique: true
        },
        link: {
            type: fug.DataTypes.STRING,
            allowNull: true,
        },
        title: {
            type: fug.DataTypes.STRING,
            allowNull: false
        },
        icon: {
            type: fug.DataTypes.STRING,
            allowNull: true
        },
        duration: {
            type: fug.DataTypes.INTEGER,
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
            allowNull: false,
            defaultValue: []
        },
        sub_tasks: {
            type: fug.DataTypes.JSON,
            allowNull: false,
            defaultValue: []
        },
        project: {
            type: fug.DataTypes.JSON,
            allowNull: false,
            defaultValue: []
        },
        status: {
            type: fug.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: TaskStatus.NOT_STARTED
        }
    })

    Task = _Task as TaskInstance

    return Task
}