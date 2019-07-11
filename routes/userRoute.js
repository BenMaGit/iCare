const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profileController')
const authController = require('../controllers/authController')


router.post('/register', profileController.register)  // /user/register
router.get('/auth', authController.auth) // /user/auth



module.exports = router