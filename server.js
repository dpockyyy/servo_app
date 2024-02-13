// Setup
require('dotenv').config()

const express = require('express')
const app = express()
const port = 9090
const servoRouter = require('./routes/servo_router.js')


// Navigation
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    fetch('http://localhost:9090/api/stats')
        .then(res => res.json())
        .then(data => {
            res.render('home', {
                MAPS_KEY: process.env.MAPS_KEY,
                data: data
            })
        })
})

app.get('/test', (req, res) => {
    res.send("It's working")
})

app.use(servoRouter)


// Port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
