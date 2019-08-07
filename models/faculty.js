const mongoose = require('mongoose')
const Schema = mongoose.Schema

const facultySchema = new Schema({
    account: String,
    password: String,
    type: String,
    name: String,

})


facultySchema.query.byType = function (type){
    return this.where({type:type})
}
facultySchema.statics.authenticate = function (account,password,type){
    return this.findOne({account: account,password: password,type:type});
}

facultySchema.statics.findAllRecord = function (){
    return this.find();
}

facultySchema.query.byEmail = function(email){
    return this.where({email:email});
}



facultySchema.statics.updateNotelistbyUserID = function(userID, notelist){
    return this.updateOne({userID: userID},{notelist: notelist});
}
facultySchema.statics.updateReviseTimebyUserID = function(userID, reviseTime){
    return this.updateOne({userID: userID},{reviseTime: reviseTime});
}

module.exports = mongoose.model("faculty", facultySchema)