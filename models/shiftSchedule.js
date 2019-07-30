const mongoose = require('mongoose')
const Schema = mongoose.Schema

const scheduleSchema = new Schema({
    therapist: String,
    day: String,
    start: String,
    end: String
})

scheduleSchema.query.byDayAndTime = function (day, time){
    return this.where({day:day, start:time})
}
scheduleSchema.statics.findAll = function(){
    return this.find()
}

module.exports = mongoose.model('Schedule', scheduleSchema)