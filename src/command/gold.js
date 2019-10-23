const p = require('../tool/print')
const Player = require('../model/Player')
const triggerCommand = 'gold'
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
                        resolve(`${nick} has ${p.gold(player.gold.toFixed(6)+' gold')}`)
                    }
                }
            });
        }
    }
}