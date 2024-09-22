import {Ref, ref} from 'vue'

export enum Views {
    TASKS,
    PLANNER,
    FOCUS
}

// TODO: Extent event listenerr
class RouterClass {
    current: Ref<Views> = ref(Views.TASKS)
    header: Ref<String> = ref("Default")

    switch(val: Views) {
        this.current.value = val
        // TODO: Somethin' somethin' event here
    }

    set_header(text: String) {
        this.header.value = text
    }
}

export var Router = new RouterClass()