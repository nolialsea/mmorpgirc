module.exports = {
    getMinutesFromString: function (str) {
        const res = str.match(new RegExp(`([0-9]){1,8}[ ]?min`))
        if (res && res[1]) {
            return parseInt(res[1])
        }
    }
}