const shiftSchedule = require('../models/shiftSchedule')
const Appointment = require('../models/appointment')

const arrangeSchedule = async (req ,res)=>{
    console.log('Shift Arrange')
    let therapist = req.body.name
    let day = req.body.start.split(' ')[0]
    let startTime = parseInt(req.body.start.split(' ')[1].split(':')[0])
    let endTime = parseInt(req.body.end.split(' ')[1].split(':')[0])
    for(let i = startTime ; i < endTime ; i++ ){
        if(endTime <= 12){
            time = i+':00AM'
        }else{
            time = i+':00PM'
        }
        let existingShift = await shiftSchedule.findOne().byDayAndTime(day, time)
        if(existingShift){
            res.json({status: 409, msg:'已有人選擇其中一個時段'})
            return
        }
    }
    for(let i = startTime ; i < endTime ; i++ ){
        if(endTime <= 12){
            start = i+':00AM'
            if(i+1 >= 12){
                end = (i+1)+':00PM'
            }else{
                end = (i+1)+':00AM'
            }
        }else{
            start = i +':00PM'
            end = (i+1)+':00PM'
        }
        let shift = new shiftSchedule({
            therapist: therapist,
            day: day,
            start: start,
            end: end
        })
        await shift.save()
        
    }
    res.json({status: 200, msg:'已成功排班'})

}

const rearrangeShift = async (req, res)=>{
    console.log('Shift re-arrange')
    let day = req.body.day
    let time = req.body.time.split(':')[0]
    //let type = req.query.type
    let subTherapist = req.body.sub
    if(time >= 12){
        time = time + ':00PM'
    }else if(time < 10){
        time = time.split('0')[1] + ':00AM'
    }else{
        time = time + ':00AM'
    }
    let shift = await shiftSchedule.findOne().byDayAndTime(day, time)
    console.log('Sub-'+ subTherapist)
    if(shift.therapist === req.body.therapist){
        shift.updateOne({therapist:subTherapist}).then(()=>{
                res.json({status:200, msg:'已成功更改'})
                return
        })
    }else{
        res.json({status: 409, msg:'你只可以修改自己的班表'})
    }
}

const getSchedule = async(req, res)=>{
    console.log('Get scheudle')
    let schedule = await shiftSchedule.findAll()
    res.json({status: 200, schedule:schedule})
}

module.exports = {
    arrangeSchedule,
    rearrangeShift,
    getSchedule}