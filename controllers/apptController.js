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

const getAppointment = async(req, res, next) => {
    let addDay = req.body.addDay; //0這周  7下周  14下下周......
    let therapist = req.body.therapist
    let type = req.body.type

    let day=new Date() ; 
    let date = day.getDate() + Number(addDay); //如果addDay是字串 可以轉成Integer
    let n = day.getDay(); //今天是這周第几天
    
    let Monday = date - n + 1 ; 
    day.setDate(Monday); //周一日期
    let appointmentList, tmp
    
    if(type == '1')
         appointmentList = await Appointment.find().byTherapist(day.toLocaleDateString(), therapist);
    else if(type =='2')
         appointmentList = await Appointment.find().byDate(day.toLocaleDateString());

    let number;
    for(let i = 1; i < 5; i++){
        number = day.getDate();   // 轉換月份的時候 (31--->1) set的數字要從一開始  
        number = number + 1 
        day.setDate(number);
        if(type == '1')
             tmp = await Appointment.find().byTherapist(day.toLocaleDateString(), therapist);
        else if(type =='2')
             tmp = await Appointment.find().byDate(day.toLocaleDateString());
    
    for(let j = 0 ; j < tmp.length; j++){
        appointmentList.push(tmp[j]);
    }
    }
    res.json({status: 200, msg: appointmentList});

//  var weekOfday = moment().format('E');//计算今天是这周第几天
//  var monday = moment().subtract(weekOfday-1, 'days').format('MM/DD/YYYY');  //周一日期
//  var Friday = moment().add(5-weekOfday, 'days').format('MM/DD/YYYY');  //周五日期


    

}



module.exports = {
    findOnDateAppt,
    checkDoubleBooked,
    checkExistingAppt,
    cancelAppt,
    reserve,
    getAppointment
}