const express = require('express')
const router = express.Router()
const apptRoute = require('./apptRoute');
const userRoute = require('./userRoute')
const therapistRoute = require('./therapistRoute')


router.use('/user', userRoute)
router.use('/appt', apptRoute)
router.use('/school', therapistRoute)





module.exports = router