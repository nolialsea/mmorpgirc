const Player = require('../model/Player')
const triggerCommand = 'mine'
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
                            const minedGold = Math.random()
                            player.gold += minedGold
                            Player.update(db, player, ()=>{})
                            resolve(`${nick} has mined ${minedGold.toFixed(2)} gold !`)
                        }
                    })
                }
            }
        });
    }
}