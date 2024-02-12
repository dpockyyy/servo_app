const fs = require('fs')
const db = require('./index')
const file = fs.readFileSync('servo_info.txt')

let test = file.toString().split(/[\r\n,]/)

for (let i = 0; i < test.length; i+= 18) {
    const sql = `
    INSERT INTO servo_info
    (objectId, featureType, description, class, fid, name, operational_status,
    owner, industryId, address, suburb, state, spatial_confidence, revised, comment, latitude, longitude)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);
    `
    db.query(sql, [test[i], test[i+1], test[i+2], test[i+3], test[i+4], test[i+5], test[i+6], test[i+7], test[i+8], test[i+9], test[i+10], test[i+11], test[i+12], test[i+13], test[i+14], test[i+15], test[i+16]])
}
