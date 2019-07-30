const mongoose = require('mongoose')
const Schema = mongoose.Schema

const profileSchema = new Schema({
    email: String,
    userID: String,
    name: String,
    registrationDate: String
})

profileSchema.statics.lookUp = function (userID){
    return this.findOne({userID:userID})
}

profileSchema.statics.findbyEmail = function (email){
    return this.findOne({email:email})
}

module.exports = mongoose.model("Profile", profileSchema)