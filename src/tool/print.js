const c = require('irc-colors')

module.exports = {
    nick(nick) {
        return c.bold(nick)
    },
    time(time) {
        return c.cyan(time)
    },
    gold(gold) {
        return c.yellow(gold)
    },
    success(text, success = 1) {
        return success < 0.40 ?
            c.bold.red(text) :
            success < 0.60 ?
            c.bold.yellow(text) :
            c.bold.green(text)
    }
}