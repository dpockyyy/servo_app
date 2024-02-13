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
    let stations = []
    fetch('http://localhost:9090/api/stations/all')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < 10; i++) {
                stations.push(data[i])
            }
            // console.log(data);
            // console.log('=========================================');
            // console.log(stations);
        })
        .then(() => {
            res.render('home', {
                MAPS_KEY: process.env.MAPS_KEY,
                stations: stations
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
