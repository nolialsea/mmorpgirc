const p = require('../tool/print')
const Player = require('../model/Player')
const triggerCommand = 'time'
let db

module.exports = (database) => {
    db = database

    return {
        triggerCommand,
        call: function (nick, account, message) {
            return new Promise(resolve => {
                if (!message.startsWith(triggerCommand)) {
                    resolve(null)
                } else {
                    if (!account) {
                        resolve(null)
                    } else {
                        Player.getByAccount(db, account, (err, player) => {
                            if (player) {
                                resolve(`${nick} has ${p.time(`${Player.getTimeLeftInMinutes(player.lastActionAt)} minutes`)} of TimeCredits`)
                            }
                        })
                    }
                }
            });
        }
    }
}