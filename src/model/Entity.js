const conf = require('../conf.json')

function log(){
    if (conf.debug){
        console.log(arguments)
    }
}

module.exports = class Entity {

    constructor(entity) {
        for (let prop in entity)
            this[prop] = entity[prop]
    }

    static createTable(db, entityName, model, callback) {
        let values = []
        for (let prop in model) {
            values.push(`${prop} ${model[prop]}`)
        }

        const sql = `CREATE TABLE IF NOT EXISTS ${entityName} (${values.join(',')})`
        log(sql)
        db.run(sql, callback)
    }

    static getByRowid(db, entityName, rowid, callback) {
        const sql = `SELECT rowid, * FROM ${entityName} WHERE rowid=?`
        log(sql, rowid)
        db.get(sql, rowid, callback)
    }

    static getByProperty(db, entityName, property, value, callback) {
        const sql = `SELECT rowid, * FROM ${entityName} WHERE ${property}=?`
        log(sql, property, value)
        db.get(sql, value, (err, entity) => {
            callback(err, entity)
        })
    }

    static findAll(db, entityName, callback) {
        const sql = `SELECT rowid, * FROM ${entityName}`
        log(sql)
        db.all(sql, (err, entities) => {
            callback(err, entities)
        })
    }

    static findByProperty(db, entityName, property, value, callback) {
        const sql = `SELECT rowid, * FROM ${entityName} WHERE ${property}=?`
        log(sql)
        db.all(sql, value, (err, entities) => {
            callback(err, entities)
        })
    }

    static save(db, entityName, entity, callback) {
        const keys = []
        for (let prop in entity) {
            keys.push(prop)
        }
        const sql = `INSERT INTO ${entityName} (${keys.join(',')}) VALUES (${keys.map(()=>'?').join(',')})`
        log(sql, keys.map((v)=>entity[v]))

        db.run(sql, keys.map((v)=>entity[v]), callback)
    }

    static updateByProperty(db, entityName, entity, property, value, callback) {
        const keys = []
        let updateProperties = []
        for (let prop in entity) {
            keys.push(prop)
            updateProperties.push(`${prop}=?`)
        }

        const sql = `UPDATE ${entityName} SET ${updateProperties.join(',')} WHERE ${property}=?`
        log(sql, property)
        const arrayEntity = keys.map((v)=>entity[v])
        arrayEntity.push(value)
        db.run(sql, arrayEntity, (err) => {
            callback(err)
        })
    }

    static saveOrUpdateByProperty(db, entityName, entity, property, value, callback) {
        Entity.getByProperty(db, entityName, property, value, (err, obj) => {
            if (err)
                callback(err)
            else if (obj)
                Entity.updateByProperty(db, entityName, entity, property, value, callback)
            else
                Entity.save(db, entityName, entity, callback)
        })
    }
}