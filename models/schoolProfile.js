const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schoolProfileSchema = new Schema({
    name: String,
    studentId: String,
    major: String,
    age: String,
    gender: String

})

schoolProfileSchema.statics.findbyID = function(id){
    return this.findOne({studentId : id})
}

module.exports = mongoose.model('SchoolProfile', schoolProfileSchema)

