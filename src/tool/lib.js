const {
    Rarity
} = require('../constant')
const conf = require('../conf')

module.exports = {
    getRandomRarity: () => {
        const r = Math.random()

        return r < 0.0001 ?
            Rarity.LEGENDARY :
            r < 0.001 ?
            Rarity.EPIC :
            r < 0.01 ?
            Rarity.RARE :
            r < 0.1 ?
            Rarity.UNCOMMON :
            Rarity.COMMON
    },
    isAdmin: (account)=>{
        return conf.admins.includes(account)
    }
}