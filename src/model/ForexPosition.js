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

	static toDto(position){
		return {
			rowid: position.rowid,
			rate: position.rate,
			investment: position.investment,
			autoCloseLoss: position.autoCloseLoss,
			autoCloseProfit: position.autoCloseProfit,
			lever: position.lever,
			isLongPosition: position.isLongPosition,
		}
	}

	static init(db, callback) {
		Entity.createTable(db, entityName, model, callback)
	}

	static getByRowid(db, rowid, callback){
		Entity.getByRowid(db, entityName, rowid, callback)
	}

	static getLastByPlayerId(db, playerId, callback){
		const sql = `SELECT rowid, * FROM ${entityName} WHERE playerId=? ORDER BY rowid DESC LIMIT 1`
        db.get(sql, playerId, (err, entities) => {
            callback(err, entities)
        })
	}

	static findAllOpen(db, callback){
		const sql = `SELECT rowid, * FROM ${entityName} WHERE profit IS NULL`
        db.all(sql, (err, entities) => {
            callback(err, entities)
        })
	}

	static findOpenByPlayerId(db, playerId, callback){
		const sql = `SELECT rowid, * FROM ${entityName} WHERE playerId=? AND profit IS NULL`
        db.all(sql, playerId, (err, entities) => {
            callback(err, entities)
        })
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