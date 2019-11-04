const Entity = require('./Entity')
const {
	getRandomRarity
} = require('../tool/lib')

const entityName = "ForexPosition"
const model = {
	playerId: 'TEXT NOT NULL',
	rate: 'REAL NOT NULL',
	investment: 'REAL NOT NULL',
	autoCloseLoss: 'REAL NOT NULL',
	autoCloseProfit: 'REAL NOT NULL',
	lever: 'INTEGER NOT NULL',
	isLongPosition: 'INTEGER NOT NULL',
	createdAt: 'INTEGER NOT NULL',
	closedAt: 'INTEGER',
	profit: 'REAL',
}

module.exports = class ForexPosition extends Entity {
	constructor(args) {
		super(args)
	}

	toDict() {
		return {
			playerId: this.playerId,
			rate: this.rate,
			investment: this.investment,
			autoCloseLoss: this.autoCloseLoss,
			autoCloseProfit: this.autoCloseProfit,
			lever: this.lever,
			isLongPosition: this.isLongPosition,
			createdAt: this.createdAt,
			closedAt: this.closedAt,
			profit: this.profit,
		}
	}

	static init(db, callback) {
		Entity.createTable(db, entityName, model, callback)
	}

	static findByPlayerId(db, playerId, callback){
		Entity.findByProperty(db, entityName, "playerId", playerId, callback)
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