<script setup lang="ts">
import {Router} from "../router"
import {PopupDriver} from "../popups"
import {NewTaskPopup, NewTaskResult} from "../popups/new_task"

import HeaderButton from "./HeaderButton.vue"

import {PlannerTask, PlannerTaskStatic} from "../models/task"
import { Reminder } from "../models/reminder"
import { ReminderMetaRelative, ReminderMetaTime, ReminderMetaOnce } from "../types"

function openPlanerTaskPopup(task: PlannerTask | null = null) {
    print("Open New Task Popup!")
    let inputs = PopupDriver.open(NewTaskPopup(), task, async (data: PlannerTaskStatic) => {
        if (PlannerTask == null) {return}

        let remindersToCreate = data.reminders
        data.reminders = []
        await remindersToCreate.awaitForEach(async (reminder_data: (ReminderMetaRelative | ReminderMetaTime | ReminderMetaOnce)) => {
            reminder_data.type = Number(reminder_data.type)
            // print(reminder_data)
            // let reminder = await Reminder.create({meta: reminder_data})
            let reminder = new Reminder({meta: reminder_data})
            data.reminders.push(reminder.id)
        })
        

        // let thisTask = await PlannerTask.create(data)
        let thisTask = new PlannerTask(data)

        print("Created Task!", thisTask)
    })

    if (inputs != null) { // this is scuffed and ghetto and I hate it and I hate it and it's not right but it works.
        let startElem: HTMLInputElement = inputs["time_start"].children[1] as HTMLInputElement 
        let endElem: HTMLInputElement = inputs["time_due"].children[1] as HTMLInputElement
        let startChange = (e: Event) => {
            print(startElem.value)
            endElem.min = startElem.value
        }

        startElem.addEventListener("input", startChange)
        startElem.addEventListener("change", startChange)

        let endChange = (e: Event) => {
            print(endElem.value)
            startElem.max = endElem.value
        }

        endElem.addEventListener("input", endChange)
        endElem.addEventListener("change", endChange)
    }
}
</script>

<template>
<div id="header">
    <p>{{ Router.header }}</p>
    <div id="header-buttons">
        <HeaderButton id="add" icon="add" :func="openPlanerTaskPopup"/>
        <HeaderButton id="notification" icon="notification" :func="() => {console.log(`Opening Notifications!`)}"/>
        <HeaderButton id="settings" icon="settings" :func="() => {console.log(`Opening Settings!`)}"/>
    </div>
</div>
</template>


<style scoped>
#header {
    font-size: 54px;
    width: calc((100% - 30px) + var(--gap));
    height: 100px;
    background: var(--theme-back-2);
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
    padding-left: 30px;

    display: flex;
    align-items: center;
    justify-content: space-between;
}

#header-buttons {
    display: flex;
}
</style>