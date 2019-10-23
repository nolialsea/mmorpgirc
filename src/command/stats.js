const c = require('irc-colors')
const p = require('../tool/print')
const Player = require('../model/Player')
const triggerCommand = 'stats'
let db

module.exports = (database) => {
    db = database

    return {
        triggerCommand,
        call: function (nick, account, player, message) {
            return new Promise(resolve => {
                if (!message.startsWith(triggerCommand)) {
                    resolve(null)
                } else {
                    if (!account) {
                        resolve(null)
                    } else {
                        resolve(`Account[${account}] Nick<${p.nick(nick)}> : Gold[${p.gold(player.gold.toFixed(6))}] TimeCredits[${p.time(Player.getTimeLeftInMinutes(player.lastActionAt))}]`)
                    }
                }
            });
        }
    }
}