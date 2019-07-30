const Profile = require('../models/profile')
const Appointment = require('../models/appointment')

async function processByDate(req, res){
    let profiles = await Profile.find()
    let registrationbyDate = {}
    for(let profile in profiles){
        if(!registrationbyDate[profiles[profile].registrationDate]){
            registrationbyDate[profiles[profile].registrationDate] = 1
        }else{
            registrationbyDate[profiles[profile].registrationDate] += 1
        }
    }
    res.json({status: 200, registationData: registrationbyDate})
}

async function getAllAppt(req, res){
    let appts = await Appointment.find().all()
    let apptbyDate = {}
    for(let index in appts){
        if(!apptbyDate[appts[index].date]){
            apptbyDate[appts[index].date] = 1
        }else{
            apptbyDate[appts[index].date] += 1
        }
    }
    res.json({status: 200, data: apptbyDate})
}


module.exports = {
                    processByDate,
                    getAllAppt}