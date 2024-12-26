export const SECOND = 1000
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24

export const WEEK = DAY * 7
export const MONTH = DAY * 30
export const YEAR = DAY * 365

export function parseDuration(duration: number) {
    let hours = Math.floor(duration / HOUR)
    let remainder = duration - (hours * HOUR)
    let minutes = (remainder / MINUTE)

    return {hours, minutes}
}

export function parseDurationString(duration: number) {
    let parsedDuration = parseDuration(duration)

    return parsedDuration.hours + ":" + String(parsedDuration.minutes).padStart(2, "0")
}