const db = require('../db')

function findAllServos() {
    const sql = `
        SELECT *
        FROM servo_info
        LIMIT 400;
    `

    return db.query(sql)
        .then(result => result.rows)
}

function findUniqueOwners() {
    const sql = `
        SELECT DISTINCT owner AS name
        FROM servo_info;
    `

    return db.query(sql)
        .then(result => result.rows)
}

module.exports = {
    findAllServos,
    findUniqueOwners
}

