const express = require('express')
const router = express.Router()
const schoolProfileController = require('../controllers/schoolProfileController')

router.post('/createProfile', schoolProfileController.createProfile) // /school/createProfile
router.post('/lookUp', schoolProfileController.lookUp) // /school/lookup





module.exports = router