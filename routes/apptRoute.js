const apptController = require('../controllers/apptController')
const express = require('express')
const router = express.Router()

router.post('/lookUp', apptController.findOnDateAppt)
router.post('/uniqueAppt', apptController.checkExistingAppt)
router.post('/remove', apptController.cancelAppt)
router.post('/check', apptController.checkDoubleBooked)
router.post('/reserve', apptController.reserve)
router.post('/all',apptController.getAppointment)

module.exports = router