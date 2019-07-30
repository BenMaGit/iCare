const express = require('express')
const router = express.Router()
const schoolProfileController = require('../controllers/schoolProfileController')
const shiftController = require('../controllers/shiftController')

router.post('/createProfile', schoolProfileController.createProfile) // /school/createProfile
router.post('/lookUp', schoolProfileController.lookUp) // /school/lookup
router.post('/schedule', shiftController.arrangeSchedule)
router.delete('/schedule', shiftController.rearrangeShift) // /schedule/{date}/{time}/{name}
router.get('/schedule', shiftController.getSchedule)






module.exports = router