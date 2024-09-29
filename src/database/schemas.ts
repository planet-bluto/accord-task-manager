import { Sequelize, Model } from "sequelize-browser"
import taskInit from "../models/task"

export default async (sequelize: Sequelize) => {

    taskInit(sequelize)

    await sequelize.sync()
}