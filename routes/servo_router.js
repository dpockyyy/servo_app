const express = require('express')
const router = express.Router()
const Servo = require('../models/servos.js')



router.get('/api/stations/all', (req, res) => {
    Servo.findAllServos()
        .then(servos => res.json(servos))
})

router.get('/api/owners', (req, res) => {
    Servo.findUniqueOwners()
        .then(owners => res.json(owners))
})

module.exports = router

