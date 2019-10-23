const Entity = require('./Entity')
const {getRandomRarity} = require('../tool/lib')

const entityName = "Pickaxe"
const model = {
    rarity: 'INTEGER NOT NULL',
    power: 'REAL NOT NULL',
    crit: 'REAL NOT NULL',
    broken: 'INTEGER NOT NULL',
    ownedBy: 'INTEGER NOT NULL',
    createdBy: 'INTEGER NOT NULL',
	createdAt: 'INTEGER NOT NULL',
}

module.exports = class Pickaxe extends Entity {
	constructor(args) {
		super(typeof args != 'string' ? args : {
            rarity: getRandomRarity(),
            power: Math.random(),
            crit: 0,
            broken: 0,
            ownedBy: args,
            createdBy: args,
            createdAt: Date.now(),
		})
	}

	toDict(){
		return {
            rarity: this.rarity,
            power: this.power,
            crit: this.crit,
            broken: this.broken,
            ownedBy: this.ownedBy,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
		}
	}

	static init(db, callback) {
		Entity.createTable(db, entityName, model, callback)
	}

	static saveOrUpdate(db, pickaxe, callback) {
		Entity.saveOrUpdateByProperty(db, entityName, pickaxe, "rowid", pickaxe.rowid, callback)
	}

	save(db, callback) {
		Entity.save(db, entityName, this.toDict(), callback)
	}

	static update(db, pickaxe, callback) {
		Entity.updateByProperty(db, entityName, pickaxe, "rowid", pickaxe.rowid, callback)
	}

	static findAll(db, callback) {
		Entity.findAll(db, entityName, callback)
	}
}