const Player = require('../model/Player')
const triggerCommand = 'stat'
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
                            resolve(`[${account}] <${nick}> : Gold[${player.gold.toFixed(2)}]`)
                        }
                    })
                }
            }
        });
    }
}