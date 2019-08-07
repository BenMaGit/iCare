const mongoose = require('mongoose')
const Schema = mongoose.Schema

const noteSchema = new Schema({
    email: String,
    name: String,
    notelist:[{date:String, note:String , consultant: String, reviseTime: String, topic: String, mark:[ {account: String }] }],
    department: String,
    studentID: String,
    age: String,
    gender: String

})


noteSchema.statics.findbyEmail = function (email){
    return this.findOne({email:email})
}
noteSchema.statics.findbyUserID = function (studentID){
    return this.findOne({studentID:studentID});
}
noteSchema.statics.findbyStudentID = function(studentID){
    return this.findOne({studentID: studentID})
}
noteSchema.statics.findbyUserIDandDate = function(studentID, date){
    return this.findOne({studentID: studentID, "notelist.date": date})
}
noteSchema.statics.findAllRecord = function (){
    return this.find();
}

noteSchema.query.byEmail = function(email){
    return this.where({email:email});
}
noteSchema.query.byEmail = function(email){
    return this.where({studentID:studentID});
}


noteSchema.statics.updateNotelistbyUserID = function(studentID, notelist){
    return this.updateOne({studentID: studentID},{notelist: notelist});
}
noteSchema.statics.updateReviseTimebyUserID = function(studentID, reviseTime){
    return this.updateOne({studentID: studentID},{reviseTime: reviseTime});
}
noteSchema.statics.updateMarkbyUserIDandDate = function(studentID, date, mark){
    return this.updateOne( {studentID: studentID, "notelist.date":date },{ $set: {"notelist.$.mark":mark} });
}
noteSchema.statics.pushMarkbyUserIDandDate = function(studentID,date,account){
    return this.updateOne({studentID: studentID, "notelist.date":date},{ $push: {"notelist.$.mark":{account: account}} })
}
noteSchema.statics.pullMarkbyUserIDandDate = function(studentID,date,account){
    return this.updateOne( {studentID: studentID, "notelist.date":date},{ $pull: {"notelist.$.mark":{account: account}} })
}

module.exports = mongoose.model("note", noteSchema)