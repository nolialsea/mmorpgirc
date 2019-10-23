const p = require('../tool/print')
const Player = require('../model/Player')
const triggerCommand = 'time'
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
                        resolve(`${p.nick(nick)} has ${p.time(`${Player.getTimeLeftInMinutes(player.lastActionAt)} minutes`)} of TimeCredits`)
                    }
                }
            });
        }
    }
}