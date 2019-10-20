const timeTool = {
    getMinutesFromString: (str) => {
        const res = str.match(new RegExp(`([0-9]){1,8}[ ]?m(in)?`))
        if (res && res[1]) {
            return parseInt(res[1])
        }
    },
    getHoursFromString: (str) => {
        const res = str.match(new RegExp(`([0-9]){1,8}[ ]?h(our)?`))
        if (res && res[1]) {
            return parseInt(res[1])
        }
    },
    getDaysFromString: (str) => {
        const res = str.match(new RegExp(`([0-9]){1,8}[ ]?d(ay)?`))
        if (res && res[1]) {
            return parseInt(res[1])
        }
    },
    getTimeInMinutesFromString: (str) => {
        const minutes = timeTool.getMinutesFromString(str)
        const hours = timeTool.getHoursFromString(str)
        const days = timeTool.getDaysFromString(str)

        let timeInMinutes = 0
        if (minutes){
            timeInMinutes += minutes
        }
        if (hours){
            timeInMinutes += hours * 60
        }
        if (days) {
            timeInMinutes += days * 60 * 24
        }

        return timeInMinutes
    },
}

module.exports = timeTool