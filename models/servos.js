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

function findRandomServos(){
    const sql = `
        SELECT * 
        FROM servo_info
        ORDER BY RANDOM()
        LIMIT 1; 
    `
    
    return db.query(sql)
        .then(result => result.rows[0])
}

function findUniqueOwners() {
    const sql = `
        SELECT DISTINCT owner AS name
        FROM servo_info;
    `

    return db.query(sql)
        .then(result => result.rows)
}

function findStats() {
    const sql = `
        SELECT * 
        FROM 
        (SELECT owner, COUNT (*) as total 
        FROM servo_info GROUP BY owner) as innerTable
        WHERE total > 1 
        ORDER BY total DESC;
    `
    let statsObject = {}

     return db.query(sql)
        .then(result => {
            statsObject.owners = result.rows
            let sql = `
                SELECT COUNT (distinct owner)
                FROM servo_info;
            `
            
            return db.query(sql)
                .then(result => {
                    console.log(result.rows.count)
                    statsObject.total_owners = result.rows[0].count
                    
                    let sql = `
                        SELECT COUNT(owner)
                        FROM servo_info;
                    `

                    return db.query(sql)
                        .then(result => {
                            statsObject.total_stations = result.rows[0].count
                            return statsObject
                        })
                })
    
        })
}

function findNearestServos(lat, lng, rad) {
    const degrees = 1/(111.1/rad)

    let sql = `
        SELECT *
        FROM servo_info
        WHERE latitude < ${(lat + degrees)}
            AND latitude > ${(lat - degrees)}
            AND longitude < ${(lng + degrees)}
            AND longitude > ${(lng - degrees)}
        LIMIT 700;
    `

    return db.query(sql)
        .then(servos => {
            let servosObj = servos.rows
            servosObj.forEach(servo => {
                servo.distance = Math.abs(servo.latitude - lat) + Math.abs(servo.longitude - lng)
            })
            return servosObj.sort((a, b) => a.distance - b.distance)
        })
}

module.exports = {
    findAllServos,
    findUniqueOwners,
    findRandomServos,
    findStats,
    findNearestServos
}

