const c = require('irc-colors')
const Player = require('../model/Player')
const triggerCommand = 'stats'
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
                            resolve(`Account[${account}] Nick<${nick}> : ${c.yellow(`Gold[${player.gold.toFixed(6)}]`)} TimeCredits[${Player.getTimeLeftInMinutes(player.lastActionAt)}]`)
                        }
                    })
                }
            }
        });
    }
}