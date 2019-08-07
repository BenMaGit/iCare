const SchoolProfile = require('../models/schoolProfile')
const Faculty = require('../models/faculty')

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

const findAllTherapists = async (req, res, next) =>{
    console.log('Fine ALL Therapist')
    let listOfTherapists = await Faculty.find().byType('1')
    let names =[]
    for(let i = 0; i < listOfTherapists.length; i++){
        names.push(listOfTherapists[i].name)
    }
    if(!listOfTherapists){
        res.json({status: 404})
    }else{
        res.json({status: 200, list: names})
    }
}

const createFaculties= (req, res, next) =>{
    let account = req.body.account
    let password = req.body.password
    let type = req.body.type
    let name = req.body.name

    let faculty = new Faculty({
        account: account,
        password: password,
        type: type,
        name: name
    })
    faculty.save().then(()=>{
        res.json({status: 200, profile: faculty})
    })
    
}

const lookUp = async (req, res, next) =>{
    console.log('Fine ALL Therapist LOOKUP')
    let profile = await SchoolProfile.findbyID(req.query.studentId)
    if(!profile){
        res.json({status: 400})
        console.log("cannt find " + req.query.studetId)
        return
    }
    console.log(profile)
    res.json({status: 200, profile: profile})
}

module.exports = {
    createProfile,
    lookUp,
    createFaculties,
    findAllTherapists
}