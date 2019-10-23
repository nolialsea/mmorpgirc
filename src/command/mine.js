const {
    getTimeInMinutesFromString
} = require('../tool/time')
const {
    nbMinutesInDay
} = require('../constant')
const p = require('../tool/print')
const Player = require('../model/Player')
const c = require('irc-colors')

const triggerCommand = 'mine'
let db

function mine(nick, player, message, resolve) {
    if (player) {
        const timeLeftTotal = Player.getTimeLeftInMinutes(player.lastActionAt)
        const randomNumber = Math.random()
        const timeAskedToMine = getTimeInMinutesFromString(message)
        let timeToMine = 0
        if (!(timeAskedToMine)) {
            timeToMine = timeLeftTotal
        } else {
            if (timeAskedToMine <= timeLeftTotal) {
                timeToMine = timeAskedToMine
            } else {
                resolve(`${p.nick(nick)} cannot mine for ${p.time(timeAskedToMine+' minutes')}: not enough TimeCredits (${c.red(timeLeftTotal)} left)`)
                return
            }
        }
        const minedGold = (randomNumber * 2) * (timeToMine / 1440) //[0-2] gold each day (~1g/day)

        if (timeLeftTotal < 1) {
            resolve(`${c.bold(nick)} has ${c.red(`no more TimeCredits`)}`)
        } else {
            const successPercent = (randomNumber * 100).toFixed(2) + '%'
            player.gold += minedGold
            player.lastActionAt = player.lastActionAt + (timeToMine * 60 * 1000)
            Player.update(db, player, () => {})
            resolve([
                `${p.nick(nick)} has mined ${p.gold(`${minedGold.toFixed(6)} gold`)} in ${p.time(`${timeToMine} minutes`)} (success: ${p.success(successPercent, randomNumber)})`
            ])
        }
    }
}

module.exports = (database) => {
    db = database

    return {
        triggerCommand,
        call: function (nick, account, player, message) {
            return new Promise(resolve => {
                if (!message.startsWith(triggerCommand) && !(message.search(triggerCommand) !== -1 && getTimeInMinutesFromString(message))) {
                    resolve(null)
                } else {
                    if (!account) {
                        resolve(null)
                    } else {
                        mine(nick, player, message, resolve)
                    }
                }
            });
        }
    }
}