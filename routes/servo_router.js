const express = require('express')
const router = express.Router()
const Servo = require('../models/servos.js')



router.get('/api/stations/all', (req, res) => {
    Servo.findAllServos()
        .then(servos => res.json(servos))
})

router.get('/api/stations/random', (req, res) => {
    Servo.findRandomServos()
        .then(servos => res.json(servos))
})

router.get('/api/owners', (req, res) => {
    Servo.findUniqueOwners()
        .then(owners => res.json(owners))
})

router.get('/api/stats', (req, res) => {
    Servo.findStats()
        .then(stats => res.json(stats))
})

router.get('/api/stations/nearest', (req, res) => {
    let lat = req.query.lat
    let lng = req.query.lng
    console.log(req.body);
    Servo.findNearestServos(-37.42, 144, 20) // (-37.42, 144, 20)
        .then(servos => {
            res.json(servos)
        })
})



module.exports = router

