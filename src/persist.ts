import {computed, Ref, ref, WritableComputedRef} from 'vue'
import { Task, PlannerTaskStatic, PlannerTask, ProjectTask } from './models/task';
import { CalendarDate } from './types'
import { Reminder } from './models/reminder'
import localforage from 'localforage'



class LocalStorageDatabase {
  ref: Ref<any[]>;
  key: string

  constructor(key: string) {
    this.ref = ref([])
    this.key = key
  }

  get value() {
    return this.ref.value
  }

  async update() {
    let static_value = JSON.parse(JSON.stringify(this.ref.value))
    await localforage.setItem(this.key, static_value)
  }

  push(val: any) {
    let dupe = this.ref.value
    dupe.push(val)

    this.ref.value = dupe

    this.update()
  }
}

// export var PlannerTasks: Ref<PlannerTask[]> = ref([])
// export var ProjectTasks: Ref<ProjectTask[]> = ref([])
// export var Reminders: Ref<Reminder[]> = ref([])

export const PlannerTasks = new LocalStorageDatabase("planner_tasks")
export const ProjectTasks = new LocalStorageDatabase("project_tasks")
export const Reminders = new LocalStorageDatabase("reminders")
// export const PlannerTasks: WritableComputedRef<PlannerTask[]> = computed({
//   get: () => {
//     return PlannerTasks_sync.value
//   },
//   set: (val: PlannerTask[]) => {
//     PlannerTasks_sync.value = val
//     localforage.setItem("planner_tasks", val)
//   },
// })

export var TaskListFilters: Ref<Function[]> = ref([])

export var FocusedDate: Ref<CalendarDate | null> = ref(null)

const STORAGE_MAP: {[index: string]: {constructor, ref: Ref}} = {
  planner_tasks: {
    constructor: PlannerTask,
    ref: PlannerTasks.ref
  },
  project_tasks: {
    constructor: ProjectTask,
    ref: ProjectTasks.ref
  },
  reminders: {
    constructor: Reminder,
    ref: Reminders.ref
  },
}

async function fetchLocalStorage() {
  // let planner_tasks = (await localforage.getItem('planner_tasks') as PlannerTaskStatic[])
  // PlannerTasks.value = planner_tasks.map((static_planner_task: PlannerTaskStatic) => {
  //   return (new PlannerTask(static_planner_task))
  // })


  // let project_tasks = (await localforage.getItem('project_tasks') as ProjectTask[])
  // let reminders = (await localforage.getItem('reminders') as Reminder[])

  await Object.keys(STORAGE_MAP).awaitForEach(async (key) => {
    let {constructor, ref} = STORAGE_MAP[key]
    let raw_result = await localforage.getItem(key)
    if (raw_result) {
      let entries = (raw_result as (typeof constructor)[])
    
      ref.value = entries.map(entry => {
        return (new constructor(entry))
      })
    }
  })
}

fetchLocalStorage()