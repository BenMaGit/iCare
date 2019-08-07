const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appointmentSchema = new  Schema({
    profile: JSON,
    date: String,
    time: String,
    topic: String
})

appointmentSchema.statics.checkAvailableTime = function(date, time){
    return this.findOne({date:date, time:time})
}
appointmentSchema.statics.findByID = function(userId){
    return this.findOne({'profile.userID':userId})
}
appointmentSchema.query.byTherapist = function(date, therapist){
    return this.where({date:date, therapist:therapist})
}

appointmentSchema.query.byDate = function(date){
    return this.where({date:date})
}

appointmentSchema.query.all = function(){
    return this.where()
}




/* appointmentSchema.query.byMonth = function(month){
    return this.find({})
} */

module.exports = mongoose.model('Appointment', appointmentSchema)