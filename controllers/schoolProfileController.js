const SchoolProfile = require('../models/schoolProfile')

const createProfile = (req, res, next) =>{
    let studentId = req.body.studentId
    let name = req.body.name
    let major = req.body.major
    let age = req.body.age
    let gender = req.body.gender

    let schoolProfile = new SchoolProfile({
        name: name,
        studentId: studentId,
        major: major,
        age: age,
        gender: gender     
    })

    schoolProfile.save().then(()=>{
        res.json({status:200, profile: schoolProfile})
    })
}

const lookUp = async (req, res, next) =>{
    let profile = await SchoolProfile.findbyID(req.body.studentId)
    if(!profile){
        res.json({status: 400})
        return
    }
    res.json({status: 200, profile: profile})
}

module.exports = {
    createProfile,
    lookUp
}