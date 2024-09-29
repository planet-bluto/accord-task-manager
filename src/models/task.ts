import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, Optional, Sequelize, CreationOptional } from "sequelize-browser"
import fug from "sequelize-browser"
import { ClockTime, InstanceRule, TaskStatus } from "../types"

// type TaskAttributes = {
//     icon?: string;
//     title: string;
//     duration: number;
//     time_start: ClockTime;
//     time_due: ClockTime;
//     rules: InstanceRule[];
//     sub_tasks: ForeignKey<string>[];
//     project?: ForeignKey<string>;
//     link?: string;
//     status: TaskStatus;
// }

// type TaskCreationAttributes = Optional<TaskAttributes, 'status' | 'icon' | 'rules' | 'sub_tasks' >

export class Task extends fug.Model<fug.InferAttributes<Task>, fug.InferCreationAttributes<Task>> {
    declare icon?: string; // null-ey
    declare title: string; // Required property on creation
    declare duration: number;
    declare time_start: ClockTime;
    declare time_due: ClockTime;
    declare rules: CreationOptional<InstanceRule[]>; // Default property
    declare sub_tasks: CreationOptional<ForeignKey<string>[]>;
    declare project?: ForeignKey<string>;
    declare link: CreationOptional<string>;
    declare status: CreationOptional<TaskStatus>;
}

export default (sequelize: Sequelize) => {
    Task.init({
        link: {
            type: fug.DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
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
            type: fug.DataTypes.UUID,
            allowNull: true,
        },
        status: {
            type: fug.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: TaskStatus.NOT_STARTED
        }
    }, {sequelize})
}