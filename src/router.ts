import {Ref, ref} from 'vue'
import { CalendarDate } from './types'
import { FocusedDate, TaskListFilters } from './persist'
import { Task } from './models/task'
import moment from 'moment'
import EventEmitter from 'eventemitter3';

export enum Views {
    TASKS,
    PLANNER,
    FOCUS
}

// TODO: Extent event listenerr
class RouterClass extends EventEmitter {
    current: Ref<Views> = ref(Views.TASKS)
    header: Ref<String> = ref("...")

    switch(val: Views, header: string) {
        this.current.value = val
        this.header.value = header
        // TODO: Somethin' somethin' event here
        this.emit("switch")
    }

    switch_to_date(date: CalendarDate) {
        this.current.value = Views.TASKS
        this.header.value = moment(date).format("MMM Do, YYYY")

        TaskListFilters.value = [(task: Task) => task.isOnDate(date)]

        FocusedDate.value = date

        // print(FocusedDate.value)

        this.emit("switch")
    }
}

export var Router = new RouterClass()