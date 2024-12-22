import {Ref, ref} from 'vue'
import { CalendarDate } from './types'
import { FocusedDate, TaskListFilters } from './persist'
import { Task } from './models/task'
import moment from 'moment'

export enum Views {
    TASKS,
    PLANNER,
    FOCUS
}

// TODO: Extent event listenerr
class RouterClass {
    current: Ref<Views> = ref(Views.TASKS)
    header: Ref<String> = ref("...")

    switch(val: Views, header: string) {
        this.current.value = val
        this.header.value = header
        // TODO: Somethin' somethin' event here
    }

    switch_to_date(date: CalendarDate) {
        this.current.value = Views.TASKS
        this.header.value = moment(date).format("MMM Do, YYYY")

        TaskListFilters.value = [(task: Task) => task.isOnDate(date)]

        FocusedDate.value = date

        print(FocusedDate.value)
    }
}

export var Router = new RouterClass()