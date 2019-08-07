const express = require('express')
const router = express.Router()
const apptRoute = require('./apptRoute');
const userRoute = require('./userRoute')
const therapistRoute = require('./therapistRoute')
const dataRoute = require('./dataRoute')
const recordRoute = require('./recordRoute')
const AuthController = require('../controllers/authController')


router.use('/user', userRoute)
router.use('/appt', apptRoute)
router.use('/data', dataRoute)

//Require authorization
router.post('/authorize', AuthController.getToken); //教職員登入
router.use(AuthController.checkToken); //這行底下都是要登入後才可執行
router.use('/school', therapistRoute)
router.use('/record',recordRoute);





module.exports = router