const {
    getTimeInMinutesFromString
} = require('../tool/time')
const p = require('../tool/print')
const Player = require('../model/Player')
const conf = require('../conf')
const {nbMinutesInDay, Rarity, RarityText} = require('../constant')
const lib = require('../tool/lib')
const Pickaxe = require('../model/Pickaxe')
const c = require('irc-colors')

const triggerCommand = 'craftPickaxe'
let db

function craftPickaxe(nick, player, message, resolve) {
    if (player) {
        const timeLeftTotal = Player.getTimeLeftInMinutes(player.lastActionAt)
        if (timeLeftTotal >= conf.pickaxe.timeToCraft) {
            timeToMine = conf.pickaxe.timeToCraft
        } else {
            resolve(`${p.nick(nick)} cannot craft a pickaxe: not enough TimeCredits (${c.red(timeLeftTotal)}/${p.time(conf.pickaxe.timeToCraft)})`)
            return
        }

        const pickaxe = new Pickaxe(player.account)
        const powerPercent = (pickaxe.power * 100).toFixed(2) + '%'
        const isAdmin = lib.isAdmin(player.account)
        player.lastActionAt = player.lastActionAt + (conf.pickaxe.timeToCraft * 60 * 1000)
        Player.update(db, player, () => {})
        
        if (isAdmin){
            if (message.match('uncommon')){
                pickaxe.rarity = Rarity.UNCOMMON
            }else if (message.match('common')){
                pickaxe.rarity = Rarity.COMMON
            }else if (message.match('rare')){
                pickaxe.rarity = Rarity.RARE
            }else if (message.match('epic')){
                pickaxe.rarity = Rarity.EPIC
            }else if (message.match('legendary')){
                pickaxe.rarity = Rarity.LEGENDARY
            }
        }
        resolve([
            `${p.nick(nick)} has crafted a pickaxe in ${p.time(conf.pickaxe.timeToCraft)} minutes ! ${p.getColorFromRarity(pickaxe.rarity, `[Rarity: ${RarityText[pickaxe.rarity]}, Power: ${powerPercent}]`)}`
        ])
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
                        Player.getByAccount(db, account, (err, player) => {
                            craftPickaxe(nick, player, message, resolve)
                        })
                    }
                }
            });
        }
    }
}