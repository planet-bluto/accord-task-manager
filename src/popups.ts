import moment from 'moment'
import {Ref, ref} from 'vue'
import { CalendarDate, CalendarDate_fromDate, CalendarDate_fromString, CalendarDate_toString, ClockTime, ClockTime_fromDate, ClockTime_fromString, ClockTime_toString, Weekday } from './types'
import { HOUR, MINUTE, parseDuration } from './time'
import { parse } from 'vue/compiler-sfc'

interface InputDictionary {[index: string]: HTMLElement}

class PopupDriverClass {
    in_popup: Ref<Boolean> = ref(false)
    current_elems: Ref<PopupElement[]> = ref([])
    submitFunc: Function | null = null

    open(lines: PopupElement[][], inputData: Object | null = null, submitFunc: Function | null = null): InputDictionary | null {
        this.submitFunc = submitFunc

        let all_elems: PopupElement[] = []
        let input_dict: InputDictionary = {}
        
        this.in_popup.value = true
        
        let popup_elem = document.getElementById("popup")

        if (popup_elem == null) {return null}

        popup_elem.replaceChildren()

        lines.forEach(elems => {
            let line = document.createElement("div")

            line.classList.add("popup-line")

            elems.forEach((elem_template: PopupElement) => {
                let elem = elem_template.compile()
                line.appendChild(elem)
                all_elems.push(elem_template)
                
                if (elem_template instanceof PopupInput) {
                    input_dict[elem_template.key as string] = elem
                }
            })

            popup_elem.appendChild(line)
        })

        this.current_elems.value = all_elems

        

        if (inputData) {
            let inputs: PopupInput[] = this.current_elems.value.filter(elem_template => elem_template instanceof PopupInput)
            Object.keys(inputData).forEach((key: string | null) => {
                let value = inputData[key as keyof Object]
                let this_elem_template = inputs.find(elem_template => elem_template.key == key)

                this_elem_template?.set(value)
            })
        }

        return input_dict
    }

    close(submit = false) {
        this.in_popup.value = false

        if (submit) {
            let data = {}

            let inputs: PopupInput[] = this.current_elems.value.filter(elem_template => elem_template instanceof PopupInput)
            inputs.forEach((elem_template: PopupInput) => {
                data[elem_template.key as keyof Object] = elem_template.value()
            })

            console.log(data)
            if (this.submitFunc) { this.submitFunc(data) }
        }
    }
}

//////////// Element Declarations ////////////

export class PopupElement {
    compile(): HTMLElement {
        var elem = document.createElement("div")

        return elem
    }
}

export class HeaderPopupElement extends PopupElement {
    text: string;

    constructor(text: string) {
        super()
        this.text = text
    }

    compile(): HTMLElement {
        var elem = document.createElement("div")

        elem.classList.add("popup-header")

        elem.textContent = this.text

        return elem
    }
}

export class SubmitPopupButton extends PopupElement {
    button_elem: HTMLElement | null = null

    constructor() {
        super()
    }

    compile(): HTMLElement {
        this.button_elem = document.createElement("button")

        this.button_elem.classList.add("popup-button")
        this.button_elem.classList.add("popup-submit-button")

        this.button_elem.textContent = "Submit"

        this.button_elem.addEventListener("click", (e: MouseEvent) => {
            PopupDriver.close(true)
        })

        return this.button_elem
    }
}

//////////// Input Declarations ////////////////

export class PopupInput extends PopupElement {
    label: string | null
    key: string | null
    def: any = null

    constructor(label: string | null, key: string | null, def: any = null) {
        super()
        this.label = label
        this.key = key
        this.def = def
    }

    value(): any {
        return null
    }

    set(thisValue: any) {
        thisValue
    }
}

export class NumberPopupInput extends PopupInput {
    elem: HTMLInputElement | null = null
    min: number
    max: number

    constructor(label: string | null, key: string | null, def: number = 0, min: number = 0, max: number = Infinity) {
        super(label, key, def)

        this.min = min
        this.max = max
    }

    compile(): HTMLElement {
        var container = document.createElement("div")

        container.classList.add("popup-input-container")

        var label = document.createElement("p")

        label.classList.add("popup-input-label")
        label.textContent = this.label

        var elem = document.createElement("input")

        this.elem = elem

        elem.classList.add("popup-input")
        elem.classList.add("popup-number-input")

        elem.type = "number"
        if (this.def != null) {
            elem.defaultValue = this.def
            elem.value = this.def
        }
        elem.min = String(this.min)
        elem.max = String(this.max)

        container.appendChild(label)
        container.appendChild(elem)

        return container
    }

    value(): any {
        return (this.elem ? Number(this.elem.value) : null)
    }

    set(thisValue: number) {
        if (this.elem) { this.elem.value = String(thisValue) }
    }
}

export class TextPopupInput extends PopupInput {
    elem: HTMLInputElement | null = null

    constructor(label: string | null, key: string | null, def: string = "") {
        super(label, key, def)
    }

    compile(): HTMLElement {
        var container = document.createElement("div")

        container.classList.add("popup-input-container")

        var label = document.createElement("p")

        label.classList.add("popup-input-label")
        label.textContent = this.label

        var elem = document.createElement("input")

        this.elem = elem

        elem.classList.add("popup-input")
        elem.classList.add("popup-text-input")

        elem.type = "text"
        if (this.def != null) {
            elem.defaultValue = this.def
            elem.value = this.def
        }

        container.appendChild(label)
        container.appendChild(elem)

        return container
    }

    value(): any {
        return (this.elem ? String(this.elem.value) : null)
    }

    set(thisValue: String) {
        if (this.elem) { this.elem.value = thisValue.toString() }
    }
}

export class MultiSelectPopupInput extends PopupInput {} // <- 🟥

export class SelectPopupInput extends PopupInput {} // <- 🟥

type RepeatsObject = {
    amount: number,
    unit: ("hours" | "days" | "weeks" | "months" | "years"),
    weekdays: Weekday[]
}

export class RepeatsPopupInput extends PopupInput {
    elem: HTMLInputElement | null = null

    constructor(label: string | null, key: string | null, def: RepeatsObject = {amount: 1, unit: "days", weekdays: []}) {
        super(label, key, def)
    }

    compile(): HTMLElement {
        var container = document.createElement("div")
        container.classList.add("popup-input-container")

        var label = document.createElement("p")
        label.classList.add("popup-input-label")
        label.textContent = this.label

        var button = document.createElement("div")
        button.classList.add("popup-input-repeats-button")
        button.textContent = "placeholder text"

        var panel = document.createElement("div")
        panel.classList.add("popup-input-repeats-panel")

        button.addEventListener("click", () => {
            if (panel.hasAttribute("active")) {
                panel.removeAttribute("active")
            } else {
                panel.setAttribute("active", "")
            }
        })

        container.appendChild(label)
        container.appendChild(button)
        container.appendChild(panel)

        return container
    }

    value(): any {
        return (this.elem ? new Date(this.elem.value).valueOf() : null)
    }

    set(thisValue: Date) {
        if (this.elem) { this.elem.value = new Date(thisValue).toDateTimeLocal() }
    }
}

export class DateTimePopupInput extends PopupInput {
    elem: HTMLInputElement | null = null
    min: number | null
    max: number | null

    constructor(label: string | null, key: string | null, def: number = Date.now(), min: number | null = null, max: number | null = null) {
        super(label, key, def)

        this.min = min
        this.max = max
    }

    compile(): HTMLElement {
        var container = document.createElement("div")

        container.classList.add("popup-input-container")

        var label = document.createElement("p")

        label.classList.add("popup-input-label")
        label.textContent = this.label

        var elem = document.createElement("input")

        this.elem = elem

        elem.classList.add("popup-input")
        elem.classList.add("popup-number-input")

        elem.type = "datetime-local"
        if (this.def != null) {
            elem.defaultValue = new Date(this.def).toDateTimeLocal()
            elem.value = new Date(this.def).toDateTimeLocal()
        }
        if (this.min) { elem.min = new Date(this.min).toDateTimeLocal() }
        if (this.max) { elem.max = new Date(this.max).toDateTimeLocal() }

        container.appendChild(label)
        container.appendChild(elem)

        return container
    }

    value(): any {
        return (this.elem ? new Date(this.elem.value).valueOf() : null)
    }

    set(thisValue: Date) {
        if (this.elem) { this.elem.value = new Date(thisValue).toDateTimeLocal() }
    }
}

export class ClockTimePopupInput extends PopupInput {
    elem: HTMLInputElement | null = null
    min: ClockTime | null
    max: ClockTime | null

    constructor(label: string | null, key: string | null, def: ClockTime = ClockTime_fromDate(new Date()), min: ClockTime | null = null, max: ClockTime | null = null) {
        super(label, key, def)

        this.min = min
        this.max = max
    }

    compile(): HTMLElement {
        var container = document.createElement("div")

        container.classList.add("popup-input-container")

        var label = document.createElement("p")

        label.classList.add("popup-input-label")
        label.textContent = this.label

        var elem = document.createElement("input")

        this.elem = elem

        elem.classList.add("popup-input")
        elem.classList.add("popup-number-input")

        elem.type = "time"
        if (this.def != null) {
            elem.defaultValue = ClockTime_toString(this.def)
            elem.value = ClockTime_toString(this.def)
        }
        if (this.min) { elem.min = ClockTime_toString(this.min) }
        if (this.max) { elem.max = ClockTime_toString(this.max) }

        container.appendChild(label)
        container.appendChild(elem)

        return container
    }

    value(): ClockTime | null {
        return (this.elem ? ClockTime_fromString(this.elem.value) : null)
    }

    set(thisValue: ClockTime) {
        if (this.elem) { this.elem.value = ClockTime_toString(thisValue) }
    }
}

export class CalendarDatePopupInput extends PopupInput {
    elem: HTMLInputElement | null = null
    min: CalendarDate | null
    max: CalendarDate | null

    constructor(label: string | null, key: string | null, def: CalendarDate = CalendarDate_fromDate(new Date()), min: CalendarDate | null = null, max: CalendarDate | null = null) {
        super(label, key, def)

        this.min = min
        this.max = max
    }

    compile(): HTMLElement {
        var container = document.createElement("div")

        container.classList.add("popup-input-container")

        var label = document.createElement("p")

        label.classList.add("popup-input-label")
        label.textContent = this.label

        var elem = document.createElement("input")

        this.elem = elem

        elem.classList.add("popup-input")
        elem.classList.add("popup-number-input")

        elem.type = "date"
        if (this.def != null) {
            elem.defaultValue = CalendarDate_toString(this.def)
            elem.value = CalendarDate_toString(this.def)
        }
        if (this.min) { elem.min = CalendarDate_toString(this.min) }
        if (this.max) { elem.max = CalendarDate_toString(this.max) }

        container.appendChild(label)
        container.appendChild(elem)

        return container
    }

    value(): CalendarDate | null {
        return (this.elem ? CalendarDate_fromString(this.elem.value) : null)
    }

    set(thisValue: CalendarDate) {
        if (this.elem) { this.elem.value = CalendarDate_toString(thisValue) }
    }
}

export class DurationPopupInput extends PopupInput {
    hour_elem: HTMLInputElement | null = null
    minute_elem: HTMLInputElement | null = null
    def: number = MINUTE * 30;

    constructor(label: string | null, key: string | null, def: number = MINUTE * 30) {
        super(label, key, def)
    }

    compile(): HTMLElement {
        let container = document.createElement("div")

        container.classList.add("popup-input-container")

        let label = document.createElement("p")

        label.classList.add("popup-input-label")
        label.textContent = this.label



        let input_container = document.createElement("div")
        input_container.classList.add("popup-input-duration-input-container")


        let {hours, minutes} = parseDuration(this.def)

        let hour_elem = document.createElement("input")

        this.hour_elem = hour_elem

        hour_elem.classList.add("popup-input")
        hour_elem.classList.add("popup-number-input")

        hour_elem.type = "number"
        if (this.def != null) {
            hour_elem.defaultValue = String(hours)
            hour_elem.value = String(hours)
        }
        hour_elem.min = String(0)
        hour_elem.max = String(23)
        hour_elem.step = String(1)

        let minute_elem = document.createElement("input")

        this.minute_elem = minute_elem

        minute_elem.classList.add("popup-input")
        hour_elem.classList.add("popup-number-input")

        minute_elem.type = "number"
        if (this.def != null) {
            minute_elem.defaultValue = String(minutes)
            minute_elem.value = String(minutes)
        }
        minute_elem.min = String(0)
        minute_elem.max = String(59)
        minute_elem.step = String(1)

        let input_container_divider = document.createElement("p")
        input_container_divider.textContent = ":"


        input_container.appendChild(hour_elem)
        input_container.appendChild(input_container_divider)
        input_container.appendChild(minute_elem)


        container.appendChild(label)
        container.appendChild(input_container)

        return container
    }

    value(): any {
        let to_return = null

        if (this.hour_elem && this.minute_elem) {
            let hours = (Number(this.hour_elem.value) * HOUR)
            let minutes = (Number(this.minute_elem.value) * MINUTE)

            to_return = hours + minutes
        }

        return to_return
    }

    set(thisValue: number) {
        let {hours, minutes} = parseDuration(thisValue)

        if (this.hour_elem && this.minute_elem) {
            this.hour_elem.value = String(hours)
            this.minute_elem.value = String(minutes)
        }
    }
}

function clone<T>(instance: T): T {
    const copy = new (instance.constructor as { new (): T })();
    Object.assign(copy, instance);
    return copy;
}

export class MultiPopupInput extends PopupInput {
    template: {[index: (number | string | "_")]: {label: string | null, input: PopupInput}};
    active_inputs: PopupInput[] = []
    type_pointer: (number | string)[] = []

    inputs_container: HTMLDivElement = document.createElement("div")

    constructor(label: string | null, key: string | null, def: [] = [], template: {[index: (number | string | "_")]: {label: string | null, input: PopupInput}} = {}) {
        super(label, key, def)

        this.template = template
    }

    instanceInput(input: PopupInput, type: string, def: any = null): void {
        let input_container = document.createElement("div")

        let this_input = clone(input)

        this.active_inputs.push(this_input)
        this.type_pointer.push(type)
        
        let input_elem = this_input.compile()

        let subtract_button = document.createElement("button")
        subtract_button.textContent = "REMOVE"

        subtract_button.addEventListener("click", (e: MouseEvent) => {
            let index = this.active_inputs.indexOf(this_input)

            this.active_inputs.remove(index)
            this.type_pointer.remove(index)
            input_container.remove()
        })

        input_container.appendChild(subtract_button)
        input_container.appendChild(input_elem)

        this.inputs_container.appendChild(input_container)

        this_input.set(def) // <- motherfuck
    }

    compile(): HTMLElement {
        this.active_inputs = []

        let container = document.createElement("div")

        container.classList.add("popup-input-container")

        let label;
        if (this.label != null) {
            label = document.createElement("p")

            label.classList.add("popup-input-label")
            label.textContent = this.label
        }

        let bottom_content = document.createElement("div")

        this.inputs_container = document.createElement("div")
        this.inputs_container.classList.add("popup-input-multi-inputs")

        let add_button = document.createElement("button")
        add_button.textContent = "NEW"
        add_button.classList.add("popup-input-add-button")

        let add_panel_list = document.createElement("div")
        add_panel_list.classList.add("popup-input-multi-panel")

        add_button.addEventListener("click", (e: MouseEvent) => {
            if (this.template["_"] != null) {
                this.instanceInput(this.template["_"].input, "_")
            } else {
                add_panel_list // <= Show this guy
            }
        })

        bottom_content.appendChild(add_button)
        bottom_content.appendChild(this.inputs_container)

        if (label) { container.appendChild(label) }
        container.appendChild(bottom_content)
        
        this.set(this.def)

        return container
    }

    value(): any {
        let toReturn: any[] = []

        this.active_inputs.forEach((input: PopupInput, index) => {
            let returning_template = input.value()

            if (returning_template instanceof Object) {
                returning_template["type"] = this.type_pointer[index]
            }

            toReturn.push(returning_template)
        })

        return toReturn
    }
    
    set(thisValue: {[index: string]: {type: string, value: any}}) {
        Object.keys(thisValue).forEach((key: string) => {
            let entry = thisValue[key]

            this.instanceInput(this.template[entry.type].input, entry.type, entry.value)
        })
    }
}

export class CardPopupInput extends PopupInput {
    rows: PopupElement[][]
    active_elems: PopupElement[] = [];

    constructor(label: string | null, key: string | null, def: any = null, rows: PopupElement[][] = []) {
        super(label, key, def)

        this.rows = rows
    }

    compile(): HTMLElement {
        this.active_elems = []
        
        let card_container = document.createElement("div")
        card_container.classList.add("popup-input-card")


        this.rows.forEach((row: PopupElement[]) => {
            let row_container = document.createElement("div")

            row.forEach((element: PopupElement) => {
                element = clone(element)

                this.active_elems.push(element)

                let elem = element.compile()

                row_container.appendChild(elem)
            })

            card_container.appendChild(row_container)
        })

        return card_container
    }

    value(): any {
        let toReturn = {}

        let active_inputs = this.active_elems.filter(popup_elem => (popup_elem instanceof PopupInput))
        active_inputs.forEach((popup_input: PopupInput) => {
            toReturn[popup_input.key as keyof Object] = popup_input.value()
        })

        return toReturn
    }

    set(thisValue: Object) {
        if (thisValue == null) { return; }

        let inputs: PopupInput[] = this.active_elems.filter(elem_template => elem_template instanceof PopupInput)
        Object.keys(thisValue).forEach((key: string | null) => {
            let value = thisValue[key as keyof Object]
            let this_elem_template = inputs.find(elem_template => elem_template.key == key)

            this_elem_template?.set(value)
        })
    }
}

export var PopupDriver = new PopupDriverClass()