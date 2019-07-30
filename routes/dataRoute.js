const dataController = require('../controllers/dataController')
const express = require('express')
const router = express.Router()

router.get('/profilesByDate', dataController.processByDate)
router.get('/appointments', dataController.getAllAppt)

module.exports = router