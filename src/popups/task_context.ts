import { PlannerTask, Task } from "../models/task";
import { PlannerTasks } from "../persist";
import { PopupButton, PopupDriver } from "../popups";
import { openPlannerTaskPopup } from "./new_task";

export const PlannerTaskContextPopup = (task: PlannerTask) => [
  [new PopupButton("Edit", () => {openPlannerTaskPopup(task)})],
  [new PopupButton("Clone", () => {openPlannerTaskPopup(task, true)})],
  [new PopupButton("Delete", () => {PlannerTasks.deleteEntry(task.id); PopupDriver.close()})],
]