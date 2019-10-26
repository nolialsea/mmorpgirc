const {getRates} = require('../tool/forex')
const p = require('../tool/print')
const Player = require('../model/Player')
const triggerCommand = 'forex'
let db

function processValues(values){
    return {
        timestamp: parseInt(values[0].timestamp),
        bid: parseFloat(values[0].bid),
        ask: parseFloat(values[0].offer),
        spread: parseFloat(values[0].spread)
    }
}

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
                        getRates((values)=>{
                            const rate = processValues(values)
                            const lastContactInHours = (Date.now() - rate.timestamp)/1000/60/60
                            if (lastContactInHours > 1){
                                resolve(`Sorry, it looks like the market is closed since ${Math.floor(lastContactInHours)} hour(s)`)
                            }else{
                                resolve(`${JSON.stringify(rate)}`)
                            }
                        })
                    }
                }
            });
        }
    }
}