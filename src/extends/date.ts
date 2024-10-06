import moment from "moment";

declare global {
    interface Date {
        toDateTimeLocal(): string;
        toClockTime(): string;
    }
}

Date.prototype.toDateTimeLocal = () => {
    return moment(this).format("YYYY-MM-DD[T]HH:mm")
}

Date.prototype.toClockTime = () => {
    return moment(this).format("HH:mm")
}

export {}