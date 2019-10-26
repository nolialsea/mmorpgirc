const Entity = require('./Entity')
const {getRandomRarity} = require('../tool/lib')

const entityName = "ForexPosition"
const model = {
    playerId: 'TEXT NOT NULL',
    timestamp: 'INTEGER NOT NULL',
    ask: 'REAL NOT NULL',
    bid: 'REAL NOT NULL',
    spread: 'REAL NOT NULL',
    investment: 'REAL NOT NULL',
    autoCloseLoss: 'REAL NOT NULL',
    autoCloseProfit: 'REAL NOT NULL',
    lever: 'INTEGER NOT NULL',
    isLongPosition: 'INTEGER NOT NULL'
}

module.exports = class Pickaxe extends Entity {
	constructor(args) {
		super(args)
	}

	toDict(){
		return {
            playerId: this.playerId,
            timestamp: this.timestamp,
            ask: this.ask,
            bid: this.bid,
            spread: this.spread,
            investment: this.investment,
            autoCloseLoss: this.autoCloseLoss,
            autoCloseProfit: this.autoCloseProfit,
            lever: this.lever,
            isLongPosition: this.direction
		}
	}

	static init(db, callback) {
		Entity.createTable(db, entityName, model, callback)
	}

	static saveOrUpdate(db, forexPosition, callback) {
		Entity.saveOrUpdateByProperty(db, entityName, pickaxe, "rowid", forexPosition.rowid, callback)
	}

	save(db, callback) {
		Entity.save(db, entityName, this.toDict(), callback)
	}

	static update(db, forexPosition, callback) {
		Entity.updateByProperty(db, entityName, forexPosition, "rowid", forexPosition.rowid, callback)
	}

	static findAll(db, callback) {
		Entity.findAll(db, entityName, callback)
	}
}