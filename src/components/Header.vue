<script setup lang="ts">
import "../arrayLib.js"

import {Router} from "../router"
import {PopupDriver} from "../popups"
import {NewTaskPopup, NewTaskResult} from "../popups/new_task"

import HeaderButton from "./HeaderButton.vue"

import {Task} from "../models/task"
import { InstanceRule, InstanceRuleType, InstanceRuleWeek, TaskStatus } from "../types"

function openNewTaskPopup(task: Task | null = null) {
    console.log("Open New Task Popup!")
    let inputs = PopupDriver.open(NewTaskPopup, task, async (data: NewTaskResult) => {
        if (Task == null) {return}

        console.log(data)

        let thisTask = await Task.create({
            title: "Test Task!",
            duration: 10000,
            time_start: {hour: 0, minute: 30},
            time_due: {hour: 0, minute: 30},
            // rules: [],
            // sub_tasks: [],
            // status: TaskStatus.NOT_STARTED
        })

        console.log("Created Task!", thisTask.get())
    })

    if (inputs != null) { // this is scuffed and ghetto and I hate it and I hate it and it's not right but it works.
        let startElem: HTMLInputElement = inputs["start"].children[1] as HTMLInputElement 
        let endElem: HTMLInputElement = inputs["end"].children[1] as HTMLInputElement

        let startChange = (e: Event) => {
            console.log(startElem.value)
            endElem.min = startElem.value
        }

        startElem.addEventListener("input", startChange)
        startElem.addEventListener("change", startChange)

        let endChange = (e: Event) => {
            console.log(endElem.value)
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
        <HeaderButton id="add" icon="add" :func="openNewTaskPopup"/>
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