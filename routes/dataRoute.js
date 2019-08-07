const dataController = require('../controllers/dataController')
const schoolProfileController = require('../controllers/schoolProfileController')
const express = require('express')
const router = express.Router()

router.get('/profilesByDate', dataController.processByDate)
router.get('/appointments', dataController.getAllAppt)
router.get('/profiles', schoolProfileController.lookUp)  //  /school/profiles/:Id

module.exports = router