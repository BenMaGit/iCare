const express = require('express')
const router = express.Router()
const schoolProfileController = require('../controllers/schoolProfileController')
const shiftController = require('../controllers/shiftController')

router.post('/profiles', schoolProfileController.createProfile) // /school/profiles
router.post('/facultyFiles', schoolProfileController.createFaculties)// /school/facultyFiles

router.get('/therapists', schoolProfileController.findAllTherapists) // /school/therapists
router.post('/schedule', shiftController.arrangeSchedule)
router.post('/updateSchedule', shiftController.rearrangeShift) // /schedule/{date}/{time}/{name}
router.get('/schedule', shiftController.getSchedule)








module.exports = router