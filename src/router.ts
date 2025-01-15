import {Ref, ref} from 'vue'
import { CalendarDate } from './types'
import { FocusedDate, TaskListFilters } from './persist'
import { Task } from './models/task'
import moment from 'moment'
import EventEmitter from 'eventemitter3';
import { openPlannerTaskPopup } from './popups/new_task'

export enum Views {
    TASKS,
    PLANNER,
    FOCUS,
    SCHEDULES
}

// TODO: Extent event listenerr
class RouterClass extends EventEmitter {
    current: Ref<Views> = ref(Views.TASKS)
    header: Ref<String> = ref("...")
    addButtonFunc: Ref<() => void> = ref(openPlannerTaskPopup)

    switch(val: Views, header: string, addButtonFunc: () => void = null) {
        this.current.value = val
        this.header.value = header
        if (addButtonFunc) { print("new add button function", addButtonFunc); this.addButtonFunc.value = addButtonFunc }
        // TODO: Somethin' somethin' event here
        this.emit("switch")
    }

    switch_to_date(date: CalendarDate) {
        this.current.value = Views.TASKS
        this.header.value = moment(date).format("ddd MMM Do, YYYY")
        this.addButtonFunc.value = openPlannerTaskPopup

        TaskListFilters.value = [(task: Task) => task.isOnDate(date)]

        FocusedDate.value = date

        // print(FocusedDate.value)

        this.emit("switch")
    }
}

export var Router = new RouterClass()