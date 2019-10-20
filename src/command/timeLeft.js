const c = require('irc-colors')
const Player = require('../model/Player')
const triggerCommand = 'time'
let db

module.exports = (database) => {
    db = database

    return function (nick, account, message) {
        return new Promise(resolve => {
            if (!message.startsWith(triggerCommand)) {
                resolve(null)
            } else {
                if (!account) {
                    resolve(null)
                } else {
                    Player.getByAccount(db, account, (err, player) => {
                        if (player) {
                            resolve(`${nick} has ${Player.getTimeLeftInMinutes(player.lastActionAt)} TimeCredits`)
                        }
                    })
                }
            }
        });
    }
}