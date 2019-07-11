const express = require('express')
const router = express.Router()
const apptRoute = require('./apptRoute');
const userRoute = require('./userRoute')


router.use('/user', userRoute)
router.use('/appt', apptRoute)





module.exports = router