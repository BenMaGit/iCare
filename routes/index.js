const express = require('express')
const router = express.Router()
const apptRoute = require('./apptRoute');
const userRoute = require('./userRoute')
const therapistRoute = require('./therapistRoute')
const dataRoute = require('./dataRoute')


router.use('/user', userRoute)
router.use('/appt', apptRoute)
router.use('/school', therapistRoute)
router.use('/data', dataRoute)





module.exports = router