const {
    getRates
} = require('../tool/forex')
const p = require('../tool/print')
const Player = require('../model/Player')
const ForexPosition = require('../model/ForexPosition')
const conf = require('../conf')
const triggerCommand = 'forex'
let db, rate, lastContactInHours, client

function processValues(values) {
    return {
        timestamp: parseInt(values[0].timestamp),
        bid: parseFloat(values[0].bid),
        ask: parseFloat(values[0].offer),
        spread: parseFloat(values[0].spread)
    }
}

function getRate() {
    getRates((values) => {
        rate = processValues(values)
        lastContactInHours = (Date.now() - rate.timestamp) / 1000 / 60 / 60
        closePositions()
    })
}

function getProfit(forexPosition, rate) {
    if (forexPosition.isLongPosition) {
        return (rate.bid - forexPosition.rate) * forexPosition.investment * forexPosition.lever
    } else {
        return (forexPosition.rate - rate.ask) * forexPosition.investment * forexPosition.lever
    }
}

function closePositions() {
    ForexPosition.findAll(db, (err, positions) => {
        if (err) {
            console.log(err)
        } else {
            let position
            for (position of positions) {
                if (!position.closedAt) {
                    const profit = getProfit(position, rate)
                    const ratio = profit / position.investment

                    const autoCloseProfit = ratio > 0 && ratio > position.autoCloseProfit
                    const autoCloseLoss = ratio < 0 && Math.abs(ratio) > position.autoCloseLoss
                    if (autoCloseProfit || autoCloseLoss) {
                        closePosition(position, profit, ratio)
                    }
                }
            }
        }
    })
}

function closePosition(position, profit, ratio) {
    position.closedAt = Date.now()
    position.profit = profit
    Player.getByAccount(db, position.playerId, (err, player) => {
        if (err) console.log(err)
        else {
            player.gold += position.investment + profit
            Player.update(db, player, (err) => {if (err) console.log(err)})
            ForexPosition.update(db, position, (err) => {if (err) console.log(err)})
            client.say(conf.channel, `Closing position of ${position.playerId} with a ${profit >= 0 ? "profit" : "loss"} of ${(ratio*100).toFixed(0)}% (${p.gold(`${profit.toFixed(6)} gold`)})`)
        }
    })
}

function createPosition(resolve, rate, player, nick, investment, isLongPosition, lever = 30, autoCloseLoss = 0.5, autoCloseProfit = 0.5) {
    let forexPosition = new ForexPosition({
        playerId: player.account,
        rate: isLongPosition === 1 ? rate.ask : rate.bid,
        investment: investment,
        autoCloseLoss: autoCloseLoss,
        autoCloseProfit: autoCloseProfit,
        lever: lever,
        isLongPosition: isLongPosition,
        createdAt: Date.now(),
        closedAt: null,
        profit: null,
    })

    forexPosition.save(db, (err) => {
        if (err) console.log("ERR: " + err)
    })

    player.gold -= investment
    Player.update(db, player, ()=>{})
    
    resolve(`${p.nick(nick)} takes a ${isLongPosition ? "long" : "short"} position for ${p.gold(`${parseFloat(investment)} gold`)}. Rates: [ask:${rate.ask}, bid: ${rate.bid}]`)
    return forexPosition
}

function minMax(min, max, value) {
    return Math.max(min, Math.min(max, value))
}

function processRate(nick, player, rate, message, resolve) {
    let goldMatch = message.match(/([0-9]{1,99}(\.[0-9]{1,6})?)g/)
    let leverMatch = message.match(/l(ever)?[ ]?([0-9]{1,4})/)
    let autoCloseLossMatch = message.match(/(auto)?(Close)?[Ll]{1}oss[ ]?([0-9]{1}(\.[0-9]{1,6})?)/)
    let autoCloseProfitMatch = message.match(/(auto)?(Close)?[Pp]{1}rofit[ ]?([0-9]{1}(\.[0-9]{1,6})?)/)
    let matchPosition = message.match(/pos(ition)?/)

    let gold
    let lever
    let autoCloseLoss
    let autoCloseProfit

    if (goldMatch) {
        gold = minMax(0.0001, 999999999999, parseFloat(goldMatch[1]))
    }
    if (leverMatch) {
        lever = minMax(1, 1000, parseInt(leverMatch[2]))
    }
    if (autoCloseLossMatch) {
        autoCloseLoss = minMax(0.01, 0.5, parseFloat(autoCloseLossMatch[3]))
    }
    if (autoCloseProfitMatch) {
        autoCloseProfit = minMax(0.01, 0.5, parseFloat(autoCloseProfitMatch[3]))
    }

    if (gold && !matchPosition) {
        if (player.gold >= gold){
            if (message.match("(long|buy)")) {
                createPosition(resolve, rate, player, nick, gold, 1, lever, autoCloseLoss, autoCloseProfit)
            } else if (message.match("(short|sell)")) {
                createPosition(resolve, rate, player, nick, gold, 0, lever, autoCloseLoss, autoCloseProfit)
            }
        } else {
            resolve(`Player ${nick} does not have enough gold (${p.gold(`${player.gold.toFixed(6)}/${gold}`)})`)
        }
    } else {
        if (!matchPosition){
            resolve(`Forex rates : ${JSON.stringify(rate)}`)
        }else{
            ForexPosition.findOpenByPlayerId(db, player.account, (err, positions)=>{
                if (err) console.log(err)
                else {
                    resolve(`${JSON.stringify(positions)}`)
                }
            })
        }
    }
}

module.exports = (database, client_) => {
    client = client_
    db = database

    setInterval(getRate, 5000)

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
                            if (lastContactInHours > 1) {
                                resolve(`Sorry, it looks like the market is closed since ${Math.floor(lastContactInHours)} hour(s)`)
                            } else {
                                processRate(nick, player, rate, message, resolve)
                            }
                        })
                    }
                }
            });
        }
    }
}