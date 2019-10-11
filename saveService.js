const fs = require("fs")

module.exports = {
    load: function (filename) {
        return JSON.parse(fs.readFileSync(filename))
    },
    save: function (fileName, data) {
        fs.writeFileSync(fileName, JSON.stringify(data))
    }
}