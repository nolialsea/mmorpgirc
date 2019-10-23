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
    },
    common(text){
        return c.bgblack.gray(text)
    },
    uncommon(text){
        return c.bgblack.white(text)
    },
    rare(text){
        return c.bgblack.lightgreen(text)
    },
    epic(text){
        return c.bgblack.pink(text)
    },
    legendary(text){
        return c.bgblack.yellow(text)
    },
    getColorFromRarity(rarity, text){
        return ([
            this.common(text),
            this.uncommon(text),
            this.rare(text),
            this.epic(text),
            this.legendary(text),
        ])[rarity]
    }
}