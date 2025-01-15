import moment from 'moment'
import {nextTick, Ref, ref} from 'vue'
import { CalendarDate, CalendarDate_fromDate, CalendarDate_fromString, CalendarDate_toString, CalendarWeek, CalendarWeek_fromString, CalendarWeek_toString, ClockTime, ClockTime_fromDate, ClockTime_fromString, ClockTime_toString, Weekday } from './types'
import { HOUR, MINUTE, parseDuration } from './time'
import { Snowflake } from '@sapphire/snowflake';
import { deepAssign } from './deepAssign';
const snowflake = new Snowflake(SNOWFLAKE_EPOCH);

interface InputDictionary {[index: string]: HTMLElement}

const elemToClassCache: Map<HTMLElement, string> = new Map()
const classToElemCache: Map<string, HTMLElement> = new Map()

class PopupDriverClass {
    currentData: object = {}
    in_popup: Ref<Boolean> = ref(false)
    current_elems: Ref<PopupElement[]> = ref([])
    submitFunc: Function | null = null

    open(lines: PopupElement[][], inputData: Object | null = null, submitFunc: Function | null = null): {inputs: InputDictionary, elems: PopupElement[], html_elems: HTMLElement[]} | null {
        this.currentData = (inputData || {})
        this.submitFunc = submitFunc

        elemToClassCache.clear()
        classToElemCache.clear()
        let all_elems: PopupElement[] = []
        let all_html_elems: HTMLElement[] = []
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
                all_html_elems.push(elem)
                
                if (elem_template instanceof PopupInput) {
                    input_dict[elem_template.key as string] = elem
                    line.setAttribute("has_property_"+elem_template.key, "true")
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

        return {inputs: input_dict, elems: all_elems, html_elems: all_html_elems}
    }

    close(submit = false) {
        this.in_popup.value = false

        if (submit) {
            let data = {}

            let inputs: PopupInput[] = this.current_elems.value.filter(elem_template => elem_template instanceof PopupInput)
            inputs.forEach((elem_template: PopupInput) => {
                data[elem_template.key as keyof Object] = elem_template.value()
            })

            print(data)
            let final_data = deepAssign(this.currentData, data)

            console.log(final_data)
            if (this.submitFunc) { this.submitFunc(final_data) }
        }
    }
}

//////////// Element Declarations ////////////

export class PopupElement {
    id: string;

    constructor() {
        this.id = String(snowflake.generate())
    }

    _compile(): HTMLElement {
        var elem = document.createElement("div")

        return elem
    }

    compile(): HTMLElement {
        let elem = this._compile()
        elemToClassCache.set(elem, this.id)
        classToElemCache.set(this.id, elem)
        print(elemToClassCache, classToElemCache)
        return elem
    }
}

export class HeaderPopupElement extends PopupElement {
    text: string;

    constructor(text: string) {
        super()
        this.text = text
    }

    _compile(): HTMLElement {
        var elem = document.createElement("div")

        elem.classList.add("popup-header")

        elem.textContent = this.text

        return elem
    }
}

export class SubHeaderPopupElement extends PopupElement {
    text: string;

    constructor(text: string) {
        super()
        this.text = text
    }

    _compile(): HTMLElement {
        var elem = document.createElement("div")

        elem.classList.add("popup-subheader")

        elem.textContent = this.text

        return elem
    }
}

export class SubmitPopupButton extends PopupElement {
    button_elem: HTMLElement | null = null

    constructor() {
        super()
    }

    _compile(): HTMLElement {
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

export class PopupButton extends PopupElement {
    button_elem: HTMLElement | null = null
    label: string;
    func: () => void;

    constructor(label, func) {
        super()
        this.label = label
        this.func = func
    }

    _compile(): HTMLElement {
        this.button_elem = document.createElement("button")

        this.button_elem.classList.add("popup-button")
        this.button_elem.classList.add("popup-submit-button")

        this.button_elem.textContent = this.label

        this.button_elem.addEventListener("click", (e: MouseEvent) => {
            this.func()
        })

        return this.button_elem
    }
}

//////////// Input Declarations ////////////////

export class PopupInput extends PopupElement {
    label: string | null
    key: string | null
    def: any = null
    nulled: boolean = false

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

export class CheckboxPopupInput extends PopupInput {
    elem: HTMLInputElement | null = null
    label_elem: HTMLParagraphElement | null = null

    constructor(label: string | null, key: string | null, def: boolean = false) {
        super(label, key, def)
    }

    _compile(): HTMLElement {
        let cont = document.createElement("div")
        cont.classList.add("popup-checkbox-element")

        this.elem = document.createElement("input")
        this.elem.type = "checkbox"
        this.elem.setAttribute("task_override_checkbox", "")
        cont.appendChild(this.elem)
        this.elem.checked = this.def

        this.label_elem = document.createElement("p")
        this.label_elem.textContent = this.label
        cont.appendChild(this.label_elem)
        this.label_elem.addEventListener("click", e => {
            this.elem.checked = (!this.elem.checked)
        })

        return cont
    }

    value(): boolean {
        return (this.elem ? this.elem.checked : false)
    }

    set(thisValue: boolean) {
        if (this.elem) { this.elem.checked = thisValue; print("CHECKED... set!") }
    }
}

export class TaskOverrideCheckboxPopupInput extends CheckboxPopupInput {
    _compile(): HTMLElement {
        let cont = super._compile()

        const toggleOverride = () => {
            let card_elem = (this.elem.parentNode.parentNode.parentNode as HTMLElement)
            let popupLines = [card_elem.querySelector("*[has_property_time_start=true]"), card_elem.querySelector("*[has_property_duration=true]"), card_elem.querySelector("*[has_property_time_due=true]")]
            print(popupLines)
            popupLines.forEach(popupLine => {
                popupLine.toggleAttribute("hidden")
            })
        }

        nextTick().then(() => {
            if (!this.elem.checked) {toggleOverride()}
        })
        this.elem.onchange = toggleOverride

        this.label_elem.onclick = e => {
            this.elem.checked = (!this.elem.checked)
            toggleOverride()
        }

        return cont
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

    _compile(): HTMLElement {
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

    _compile(): HTMLElement {
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

    value(): string | null {
        return (this.elem ? String(this.elem.value) : null)
    }

    set(thisValue: String) {
        if (this.elem) { this.elem.value = thisValue.toString() }
    }
}

export class SelectPopupInput extends PopupInput { // <- 🟥
    elem?: HTMLSelectElement;
    options: {[text: string]: (string | number | boolean)};
    cast: ("string" | "number" | "boolean");

    constructor(label: string | null, key: string | null, options: (string[] | {[text: string]: (string | number | boolean)}) = [], def: number = 0, cast: ("string" | "number" | "boolean") = "string") {
        super(label, key, def)

        if (Array.isArray(options)) {
            this.options = {}
            options.forEach(option => {
                this.options[option] = option
            })
        } else {
            this.options = options
        }

        this.cast = cast
    }

    _compile(): HTMLElement {
        var container = document.createElement("div")
        container.classList.add("popup-input-container")

        var label = document.createElement("p")
        label.classList.add("popup-input-label")
        label.textContent = this.label

        var select_elem = document.createElement("select")
        select_elem.multiple = false
        select_elem.classList.add("popup-input-select")
        
        Object.keys(this.options).forEach(text => {
            let option = this.options[text]
            let option_elem = document.createElement("option")

            option_elem.value = String(option)
            option_elem.textContent = text

            select_elem.appendChild(option_elem)
        })

        select_elem.selectedIndex = this.def

        this.elem = select_elem

        container.appendChild(label)
        container.appendChild(select_elem)

        return container
    }

    value(): any {
        if (this.elem) {
            let finalVal: any = this.elem.selectedOptions[0].value
            switch (this.cast) {
                case "number":
                    finalVal = Number(this.elem.selectedOptions[0].value)
                break;
                case "boolean":
                    finalVal = (this.elem.selectedOptions[0].value == "true")
                break;
            }

            return finalVal
        } else {
            return null
        }
    }

    set(thisValue: any) {
        if (this.elem) {
            let index = Array.from(this.elem.options).map(optionElem => optionElem.value).indexOf(String(thisValue))
            this.elem.selectedIndex = index
        }
    }
}

export class MultiSelectPopupInput extends PopupInput { // <- 🟥
    elems: {[index: string]: HTMLInputElement} = {};
    options: string[];

    constructor(label: string | null, key: string | null, options: string[]= [], def: string[] = []) {
        super(label, key, def)

        this.options = options
    }

    _compile(): HTMLElement {
        var container = document.createElement("div")
        container.classList.add("popup-input-container")

        var label = document.createElement("p")
        label.classList.add("popup-input-label")
        label.textContent = this.label

        var checkbox_container = document.createElement("div")
        checkbox_container.classList.add("popup-input-mutli-select-checkbox-container")
        
        this.options.forEach(option => {
            let this_cont = document.createElement("div")

            let this_label = document.createElement("p")
            this_label.textContent = option //titleCase PLEASE

            let this_input = document.createElement("input")
            this_input.type = "checkbox"
            this.elems[option] = this_input

            this_cont.appendChild(this_label)
            this_cont.appendChild(this_input)

            checkbox_container.appendChild(this_cont)
        })

        container.appendChild(label)
        container.appendChild(checkbox_container)

        return container
    }

    value(): string[] {
        let returnArr: string[] = []

        Object.keys(this.elems).forEach(key => {
            let elem = this.elems[key]
            if (elem.checked) {
                returnArr.push(key)
            }
        })

        return returnArr
    }

    set(thisValue: string[]) {
        Object.keys(this.elems).forEach(key => {
            let elem = this.elems[key]
            elem.checked = thisValue.includes(key)
        })
    }
}

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

    _compile(): HTMLElement {
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

    _compile(): HTMLElement {
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

    set(thisValue: number) {
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

    _compile(): HTMLElement {
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

    _compile(): HTMLElement {
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
            print(this.def)
            print(CalendarDate_toString(this.def))
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

export class WeekPopupInput extends PopupInput {
    elem: HTMLInputElement | null = null

    constructor(label: string | null, key: string | null, def: CalendarWeek = ({week: moment().week(), year: moment().year()})) {
        super(label, key, def)
    }

    _compile(): HTMLElement {
        var container = document.createElement("div")

        container.classList.add("popup-input-container")

        var label = document.createElement("p")

        label.classList.add("popup-input-label")
        label.textContent = this.label

        var elem = document.createElement("input")

        this.elem = elem

        elem.classList.add("popup-input")
        elem.classList.add("popup-week-input")

        elem.type = "week"
        if (this.def != null) {
            elem.defaultValue = CalendarWeek_toString(this.def)
            elem.value = CalendarWeek_toString(this.def)
        }

        container.appendChild(label)
        container.appendChild(elem)

        return container
    }

    value(): any {
        return (this.elem ? CalendarWeek_fromString(this.elem.value) : null)
    }

    set(thisValue: CalendarWeek) {
        if (this.elem) { this.elem.value = CalendarWeek_toString(thisValue) }
    }
}

export class DurationPopupInput extends PopupInput {
    hour_elem: HTMLInputElement | null = null
    minute_elem: HTMLInputElement | null = null
    def: number = MINUTE * 30;

    constructor(label: string | null, key: string | null, def: number = MINUTE * 30) {
        super(label, key, def)
    }

    _compile(): HTMLElement {
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

// const clone = structuredClone

export class MultiPopupInput extends PopupInput {
    template: () => {[index: (number | string | "_")]: {label: string | null, input: (() => PopupInput)}};
    active_inputs: PopupInput[] = []
    type_pointer: (number | string)[] = []

    inputs_container: HTMLDivElement = document.createElement("div")

    constructor(label: string | null, key: string | null, def: [] = [], template: () => {[index: (number | string | "_")]: {label: string | null, input: (() => PopupInput)}} = () => ({})) {
        super(label, key, def)

        this.template = template
    }

    instanceInput(this_input: PopupInput, type: string, def: any = null): void {
        print("Type: ", type)
        let input_container = document.createElement("div")
        input_container.classList.add("popup-input-card-container")

        // let this_input = clone(input)
        // print("Clone result: ", this_input)

        this.active_inputs.push(this_input)
        this.type_pointer.push(type)
        
        let input_elem = this_input.compile()

        let subtract_button = document.createElement("button")
        subtract_button.textContent = "X"
        subtract_button.classList.add("popup-input-card-remove")

        subtract_button.addEventListener("click", (e: MouseEvent) => {
            let index = this.active_inputs.indexOf(this_input)

            this.active_inputs.remove(index)
            this.type_pointer.remove(index)
            input_container.remove()
        })

        input_container.appendChild(subtract_button)
        input_container.appendChild(input_elem)

        this.inputs_container.appendChild(input_container)

        print("[CardInput] this_input: ", this_input)

        this_input.set(def) // <- motherfuck
    }

    _compile(): HTMLElement {
        let this_template = this.template()
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

        // let add_button = document.createElement("button")
        // add_button.textContent = "NEW"
        // add_button.classList.add("popup-input-add-button")

        print("uhm??...")
        let add_panel_list = document.createElement("div")
        add_panel_list.classList.add("popup-input-multi-panel")
        // add_button.appendChild(add_panel_list)

        let keys: string[] = Object.keys(this_template)

        add_panel_list.replaceChildren()

        keys.forEach(key => {
            let key_button = document.createElement("button")

            key_button.textContent = (key == "_" ? "New" : this_template[key].label) // make titleCase function
            key_button.onclick = e => {
                e.preventDefault()

                this.instanceInput(this_template[key].input(), key)
            }

            add_panel_list.appendChild(key_button)
        })

        bottom_content.appendChild(add_panel_list)
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
            print(`Multi [${index}]: `, input.value())

            if (returning_template instanceof Object) {
                returning_template["type"] = this.type_pointer[index]
            }

            toReturn.push(returning_template)
        })

        return toReturn
    }
    
    set(thisValue: {[index: string | number]: {type: string, value: any}}) {
        Object.keys(thisValue).forEach((key: any) => {
            let entry = thisValue[key]
            print("KEY: ", key, " ENTRY: ", entry)
            this.instanceInput(this.template()[entry.type].input(), entry.type, entry)
        })
    }
}

export class CardPopupInput extends PopupInput {
    rows: (() => PopupElement[][]);
    active_elems: PopupElement[] = [];

    constructor(label: string | null, key: string | null, def: any = null, rows: (() => PopupElement[][]) = (() => [])) {
        super(label, key, def)

        this.rows = rows
    }

    _compile(): HTMLElement {
        this.active_elems = []
        
        let whole_container = document.createElement("div")
        whole_container.classList.add("popup-input-card-whole-container")

        if (this.label) {
            let label = document.createElement("p")
            label.classList.add("popup-input-label")
            label.textContent = this.label
            whole_container.appendChild(label)
        }

        let card_container = document.createElement("div")
        card_container.classList.add("popup-input-card")

        this.rows().forEach((row: PopupElement[]) => {
            let row_container = document.createElement("div")
            row_container.classList.add("popup-line")

            row.forEach((element: PopupElement) => {
                this.active_elems.push(element)

                let elem = element.compile()

                if (element instanceof PopupInput) {
                    row_container.setAttribute("has_property_"+element.key, "true")
                }

                row_container.appendChild(elem)
            })

            card_container.appendChild(row_container)
        })

        whole_container.appendChild(card_container)

        return whole_container
    }

    value(): any {
        let toReturn = {}

        let active_inputs = this.active_elems.filter(popup_elem => (popup_elem instanceof PopupInput))
        active_inputs.forEach((popup_input: PopupInput, index: number) => {
            // print(`Card [${index}]: `, popup_input.value())
            print(popup_input, classToElemCache.get(popup_input.id))
            if (!(popup_input.nulled || classToElemCache.get(popup_input.id).parentElement.hasAttribute("hidden"))) {
                toReturn[popup_input.key as keyof Object] = popup_input.value()
            }
        })

        return toReturn
    }

    set(thisValue: Object) {
        print("[CardInput] thisValue: ", thisValue)
        if (thisValue == null) { return; }

        let inputs: PopupInput[] = this.active_elems.filter(elem_template => elem_template instanceof PopupInput)
        Object.keys(thisValue).forEach((key: string | null) => {
            let value = thisValue[key as keyof Object]
            let this_elem_template = inputs.find(elem_template => elem_template.key == key)
            print("[CardInput] this_elem_template: ", this_elem_template)
            this_elem_template?.set(value)
        })
    }
}

export const PopupDriver = new PopupDriverClass()