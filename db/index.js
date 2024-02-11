require('dotenv').config()
const pg = require('pg')

if (!process.env.DATABASE_URL) {
    throw Error('database url missing;')
}

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL
})

module.exports = pool