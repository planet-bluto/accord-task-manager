const Printer = {
    print: print.bind(this)
}

declare global {
    // type print = (...args: any[]) => void
    function print(...args: any[]): void
    interface Printer {
        print(): void
    }
}

Window.prototype.print = console.log
window.print = console.log

export {}