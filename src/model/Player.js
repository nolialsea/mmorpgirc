const Entity = require('./Entity')

const entityName = "Player"
const model = {
	account: 'TEXT UNIQUE NOT NULL PRIMARY KEY',
	gold: 'REAL NOT NULL',
	level: 'REAL NOT NULL',
	pickaxeId: 'INTEGER',
	guildId: 'INTEGER',
	createdAt: 'INTEGER NOT NULL'
}

module.exports = class Player extends Entity {
	constructor(args) {
		super(typeof args != 'string' ? args : {
			account: args,
			gold: 0,
			level: 0,
			pickaxeId: -1,
			guildId: -1,
			createdAt: Date.now()
		})
	}

	toDict(){
		return {
			account: this.account,
			gold: this.gold,
			level: this.level,
			pickaxeId: this.pickaxeId,
			guildId: this.guildId,
			createdAt: this.createdAt,
		}
	}

	static init(db, callback) {
		Entity.createTable(db, entityName, model, callback)
	}

	saveOrUpdate(db, callback) {
		Entity.saveOrUpdateByProperty(db, entityName, this, "account", this.account, callback)
	}

	save(db, callback) {
		Entity.save(db, entityName, this.toDict(), callback)
	}

	static update(db, player, callback) {
		Entity.updateByProperty(db, entityName, player, "account", player.account, callback)
	}

	static getByAccount(db, account, callback) {
		Entity.getByProperty(db, entityName, 'account', account, callback)
	}

	static findAll(db, callback) {
		Entity.findAll(db, entityName, callback)
	}
}