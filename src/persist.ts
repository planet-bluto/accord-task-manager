import {computed, Ref, ref, WritableComputedRef} from 'vue'
import { Task, PlannerTaskStatic, PlannerTask, ProjectTask } from './models/task';
import { CalendarDate } from './types'
import { Reminder } from './models/reminder'
import localforage from 'localforage'
import moment from 'moment';
import { Schedule } from './models/schedule';
import EventEmitter from 'eventemitter3';


class deadassjustoneeventclass extends EventEmitter {}
const deadassjustoneevent = new deadassjustoneeventclass()

export const currMonth = ref(Number(moment().get("month")))
export const currYear = ref(Number(moment().get("year")))

var is_fetched = false

async function fetched() {
  return new Promise<void>((res, rej) => {
    if (!is_fetched) {
      res()
    } else {
      deadassjustoneevent.on("fetched", () => {
        res()
      })
    }
  })
}

class LocalStorageDatabase {
  ref: Ref<any[]>;
  key: string;
  fetched: () => Promise<void>

  constructor(key: string) {
    this.ref = ref([])
    this.key = key
    this.fetched = fetched
  }

  get value() {
    return this.ref.value
  }

  get is_fetched() {
    return is_fetched
  }

  async update() {
    await fetched()
    let static_value = JSON.parse(JSON.stringify(this.ref.value))
    await localforage.setItem(this.key, static_value)
  }

  async updateEntry(id: string, data: any) {
    await fetched()
    let entryIdx = this.ref.value.findIndex((entry) => entry.id == id)
    if (entryIdx != -1) {
      let entry = this.ref.value[entryIdx]
      let newEntry = Object.assign(entry, data)
      this.ref.value[entryIdx] = newEntry

      this.update()
    }
  }

  findEntry(id: string) {
    // await fetched()
    return this.ref.value.find((entry) => entry.id == id)
  }

  async deleteEntry(id: string) {
    await fetched()
    // this.ref.value = this.ref.value.filter((entry) => entry.id != id)
    let idx = this.ref.value.findIndex((entry) => entry.id == id)
    this.ref.value.remove(idx)
    this.update()
  }

  async push(val: any) {
    await fetched()
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
export const Schedules = new LocalStorageDatabase("schedules")
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
  // reminders: {
  //   constructor: Reminder,
  //   ref: Reminders.ref
  // },
  schedules: {
    constructor: Schedule,
    ref: Schedules.ref
  },
}

async function fetchLocalStorage() {
  // let planner_tasks = (await localforage.getItem('planner_tasks') as PlannerTaskStatic[])
  // PlannerTasks.value = planner_tasks.map((static_planner_task: PlannerTaskStatic) => {
  //   return (new PlannerTask(static_planner_task))
  // })


  // let project_tasks = (await localforage.getItem('project_tasks') as ProjectTask[])
  // // let reminders = (await localforage.getItem('reminders') as Reminder[])

  await Object.keys(STORAGE_MAP).awaitForEach(async (key) => {
    let {constructor, ref} = STORAGE_MAP[key]
    let raw_result = await localforage.getItem(key)
    if (raw_result) {
      let entries = (raw_result as (typeof constructor)[])
    
      ref.value = entries.map(entry => {
        return (new constructor(entry))
      })

      print(ref.value)
    }
  })

  // for (const key of Object.keys(STORAGE_MAP)) {
  //   let { constructor, ref } = STORAGE_MAP[key];
  //   let raw_result = await localforage.getItem(key);
  //   if (raw_result) {
  //     let entries = (raw_result as (typeof constructor)[]);
      
  //     ref.value = entries.map(entry => {
  //       return new constructor(entry);
  //     });
  //   }
  // }
}

fetchLocalStorage()

