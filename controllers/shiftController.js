const shiftSchedule = require('../models/shiftSchedule')

const arrangeSchedule = async (req ,res)=>{
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
    let day = req.query.day
    let time = req.query.time.split(':')[0]
    if(time >= 12){
        time = time + ':00PM'
    }else if(time < 10){
        time = time.split('0')[1] + ':00AM'
    }else{
        time = time + ':00AM'
    }
    console.log(day)
    console.log(time)
    console.log(req.query.name)
    let shift = await shiftSchedule.findOne().byDayAndTime(day, time)
    if(shift.therapist === req.query.name){
        shift.remove().then(()=>{
            res.json({status:200, msg:'已成功移除'})
        })
    }else{
        res.json({status: 409, msg:'你只可以修改自己的班表'})
    }
}

const getSchedule = async(req, res)=>{
    let schedule = await shiftSchedule.findAll()
    res.json({status: 200, schedule:schedule})
}

module.exports = {
    arrangeSchedule,
    rearrangeShift,
    getSchedule}