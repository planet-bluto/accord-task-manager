import moment from 'moment'
import {Ref, ref} from 'vue'

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
            Object.keys(inputData).forEach((key: string) => {
                let value = inputData[key as keyof Object]
                let this_elem_template = inputs.find(elem_template => elem_template.key == key)

                this_elem_template?.set(value)
            })
        }

        return input_dict
    }

    close(submit = true) {
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

        this.button_elem.addEventListener("click", e => {
            PopupDriver.close(true)
        })

        return this.button_elem
    }
}

//////////// Input Declarations ////////////////

export class PopupInput extends PopupElement {
    label: string
    key: string
    def: any = null

    constructor(label: string, key: string, def: any = null) {
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

Date.prototype.toDateTimeLocal = () => {
    return moment(this).format("YYYY-MM-DD[T]HH:mm")
}

type RepeatsObject = {
    amount: number,
    unit: ("hours" | "days" | "weeks" | "months" | "years"),
    weekdays: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[]
}

export class RepeatsPopupInput extends PopupInput {
    elem: HTMLInputElement | null = null

    constructor(label: string, key: string, def: RepeatsObject = {amount: 1, unit: "days", weekdays: []}) {
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

    constructor(label: string, key: string, def: number = Date.now(), min: number | null = null, max: number | null = null) {
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

export class NumberPopupInput extends PopupInput {
    elem: HTMLInputElement | null = null
    min: number
    max: number

    constructor(label: string, key: string, def: number = 0, min: number = 0, max: number = Infinity) {
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

    constructor(label: string, key: string, def: string = "") {
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

export var PopupDriver = new PopupDriverClass()