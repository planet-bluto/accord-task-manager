import {PopupDriver, HeaderPopupElement, NumberPopupInput, TextPopupInput, SubmitPopupButton, DateTimePopupInput, RepeatsPopupInput} from "../popups"

export var NewTaskPopup = [
    [new HeaderPopupElement("New Task")],
    [new TextPopupInput("Title", "title"), new TextPopupInput("Title", "title_2")],
    [new DateTimePopupInput("Start", "start"), new NumberPopupInput("Length", "length"), new DateTimePopupInput("End", "end")],
    [new RepeatsPopupInput("Repeats", "repeats")],
    [new SubmitPopupButton()],
]

export type NewTaskResult = {
    title: String,
    title_2: String,
    start: number,
    length: number,
    repeats: Object,
    end: number
}