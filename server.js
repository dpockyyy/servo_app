// Setup
require('dotenv').config()

const express = require('express')
const app = express()
const port = 9090
const pg = require('pg')


// Navigation
app.use(express.static('client'))

app.get('/test', (req, res) => {
    res.send("It's working")
})


// Port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
