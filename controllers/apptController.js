const Appointment = require('../models/appointment')
const timeChecker = require('../utils/timeChecker')



const findOnDateAppt = async (req, res, next) =>{
    let appointmentDate = await Appointment.find().byDate(req.body.date)
    res.json({info: appointmentDate})
}

const checkExistingAppt = async (req, res, next) =>{
    let existingAppt = await Appointment.findByID(req.body.userId)
    res.json({appt: existingAppt})
}

const cancelAppt = async (req, res, next) =>{
    let existingAppt = await Appointment.findByID(req.body.userId)
    existingAppt.remove().then(()=>{
        res.json({status: -1, msg: 'success!'})
})
}

const checkDoubleBooked = async (req, res, next) =>{
    let appt = await Appointment.checkAvailableTime(req.body.date, req.body.time)
    res.json({info: appt})
}

const reserve = async (req, res, next) =>{
    let profile = req.body.profile
    let date = req.body.date
    let time = req.body.time
    let topic = req.body.topic
    console.log(profile.userID)
    let existingAppt = await Appointment.findByID(profile.userID)
    if(existingAppt){
        existingAppt.remove()
        console.log('remove existing')
    }
    let appointment = new Appointment({
        profile: profile,
        date: date,
        time: time,
        topic: topic
    })
    appointment.save().then(()=>{
        res.json({status: 200, msg: 'success!'})
    })      
}



module.exports = {
    findOnDateAppt,
    checkDoubleBooked,
    checkExistingAppt,
    cancelAppt,
    reserve,
}