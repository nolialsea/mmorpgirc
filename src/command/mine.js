const {
    getMinutesFromString
} = require('../tool/time')
const Player = require('../model/Player')
const triggerCommand = 'mine'
const c = require('irc-colors')
let db

function mine(nick, player, message, resolve) {
    if (player) {
        const timeLeftTotal = Player.getTimeLeftInMinutes(player.lastActionAt)
        const randomNumber = Math.random()
        const timeAskedToMine = getMinutesFromString(message)
        let timeToMine = 0
        if (!(timeAskedToMine)) {
            timeToMine = timeLeftTotal
        } else {
            if (timeAskedToMine <= timeLeftTotal) {
                timeToMine = timeAskedToMine
            } else {
                resolve(`${c.red.bgyellow(nick)} has not enough TimeCredits (${c.red(timeLeftTotal)} left)`)
                return
            }
        }
        const minedGold = (randomNumber * 2) * (timeToMine / 1440) //[0-2] gold each day (~1g/day)

        if (timeLeftTotal < 1) {
            resolve(c.red(`${nick} has no more TimeCredits`))
        } else {
            const successPercent = (randomNumber * 100).toFixed(2)
            const successPercentMessage =
                randomNumber < 0.40 ?
                c.red(successPercent + '%') :
                randomNumber < 0.60 ?
                c.yellow(successPercent + '%') :
                c.green(successPercent + '%')
            player.gold += minedGold
            player.lastActionAt = player.lastActionAt + (timeToMine * 60 * 1000)
            Player.update(db, player, () => {})
            resolve([
                `${c.bold.red.bgyellow(nick)} has mined ${c.yellow(`${minedGold.toFixed(6)} gold`)} in ${timeToMine} minutes (success: ${successPercentMessage})`
            ])
        }
    }
}

module.exports = (database) => {
    db = database

    return function (nick, account, message) {
        return new Promise(resolve => {
            if (!message.startsWith(triggerCommand) && !(message.search(triggerCommand) !== -1 && getMinutesFromString(message))) {
                resolve(null)
            } else {
                if (!account) {
                    resolve(null)
                } else {
                    Player.getByAccount(db, account, (err, player) => {
                        mine(nick, player, message, resolve)
                    })
                }
            }
        });
    }
}