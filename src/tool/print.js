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
        return c.gray.bgblack(text)
    },
    uncommon(text){
        return c.white.bgblack(text)
    },
    rare(text){
        return c.lightgreen.bgblack(text)
    },
    epic(text){
        return c.pink.bgblack(text)
    },
    legendary(text){
        return c.yellow.bgblack(text)
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