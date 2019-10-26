const {
    getRates
} = require('../tool/forex')
const p = require('../tool/print')
const Player = require('../model/Player')
const ForexPosition = require('../model/ForexPosition')
const triggerCommand = 'forex'
let db

function processValues(values) {
    return {
        timestamp: parseInt(values[0].timestamp),
        bid: parseFloat(values[0].bid),
        ask: parseFloat(values[0].offer),
        spread: parseFloat(values[0].spread)
    }
}

function getProfit(forexPosition, rate) {
    if (forexPosition.isLongPosition) {
        return (rate.bid - forexPosition.ask) * forexPosition.investment * forexPosition.lever
    } else {
        return (forexPosition.bid - rate.ask) * forexPosition.investment * forexPosition.lever
    }
}

function createPosition(rate, player, investment, isLongPosition, lever=20, autoCloseLoss=0.5, autoCloseProfit=0.5) {
        let forexPosition = new ForexPosition({
            playerId: player.account,
            timestamp: Date.now(),
            bid: rate.bid,
            ask: rate.ask,
            spread: rate.spread,
            investment: investment,
            autoCloseLoss,
            autoCloseProfit,
            lever,
            isLongPosition
        })

        /*forexPosition.save(db, (err) => {
            if (err) console.log(err)
        })*/

        return forexPosition
}

function processRate(nick, player, rate, message, resolve) {
    let goldMatch = message.match(/([0-9]{1,99}(\.[0-9]{1,6})?)g/)
    let leverMatch = message.match(/l(ever)?[ ]?([0-9]{1,3})/)
    let autoCloseLossMatch = message.match(/(auto)?(Close)?[Ll]{1}oss[ ]?([0-9]{1}(\.[0-9]{1,6})?)/)
    let autoCloseProfitMatch = message.match(/(auto)?(Close)?[Pp]{1}rofit[ ]?([0-9]{1}(\.[0-9]{1,6})?)/)

    let gold
    let lever
    let autoCloseLoss
    let autoCloseProfit

    if (goldMatch){
        gold = parseFloat(goldMatch[1])
    }
    if (leverMatch){
        lever = parseInt(leverMatch[2])
    }
    if (autoCloseLossMatch){
        autoCloseLoss = parseFloat(autoCloseLossMatch[3])
    }
    if (autoCloseProfitMatch){
        autoCloseProfit = parseFloat(autoCloseProfitMatch[3])
    }

    if (gold) {
        if (message.match("(long|buy)")) {
            let position = createPosition(rate, player, gold, 1, lever, autoCloseLoss, autoCloseProfit)
            resolve(`${p.nick(nick)} takes a long position for ${p.gold(`${parseFloat(gold)} gold`)}`)
            console.log(position)
        } else if (message.match("(short|sell)")) {
            let position = createPosition(rate, player, gold, 0, lever, autoCloseLoss, autoCloseProfit)
            console.log(position)
            resolve(`${p.nick(nick)} takes a short position for ${p.gold(`${parseFloat(gold)} gold`)}`)
        } else {
            resolve(null)
        }
    } else {
        resolve(null)
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
                        getRates((values) => {
                            const rate = processValues(values)
                            const lastContactInHours = (Date.now() - rate.timestamp) / 1000 / 60 / 60
                            if (false && lastContactInHours > 1) {
                                resolve(`Sorry, it looks like the market is closed since ${Math.floor(lastContactInHours)} hour(s)`)
                            } else {
                                processRate(nick, player, rate, message, resolve)
                                //solve(`${JSON.stringify(rate)}`)
                            }
                        })
                    }
                }
            });
        }
    }
}