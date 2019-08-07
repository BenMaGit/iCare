const express = require('express');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const router = require('./routes')
const mongoose = require('mongoose')
const configs = require('./configs')
const bodyParser = require('body-parser')
const Appointment = require('./models/appointment')
const timeChecker = require('./utils/timeChecker')

//appointmentReminder
const appointmentReminder = async()=>{
    let timeNow = new Date().getHours() + 8
    let nextHour = timeNow + 1
    if(nextHour >= 12){
        var formattedTime = (nextHour)+':00PM'
    }else{
        var formattedTime = (nextHour)+':00AM'
    }
    let today = new Date().toLocaleDateString()
    let appt = await Appointment.checkAvailableTime(today, formattedTime)
    if(appt && timeChecker.inTime(nextHour)){
        console.log('reminder sent')
        console.log(appt)
        io.to(appt.therapist).emit('reminder', appt)
        io.emit('reminder', appt)
    }else{
        console.log('no appointment')
    }
}

setTimeout(appointmentReminder, 1000 * 10)
setInterval(appointmentReminder, 1000 * 60 * 60)



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, DELETE, PUT')
    next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/', router)

io.on('connection', function(socket){
    socket.on('room', function(room){
        console.log(room)
        socket.join(room)
    })
    socket.on('lineSent', function(obj){
        console.log(obj.message)
        console.log(obj.therapist)
        io.to(obj.therapist).emit('lineSent', obj)
      });
    socket.on('webSent', function(obj){
        console.log(obj.message)
        io.emit('webSent', obj)
    })
    socket.on('endSessionNotice', function(obj){
        console.log('Session End')
        io.emit('endSessionNotice', obj)
        //notification to desitned therapist
        //io.to(obj.appointment.therapist).emit('endSessionNotice', obj)
    })
    socket.on('endSessionReminder', function(obj){
        console.log(obj + 'End Session Reminder')
        //io.emit('endSessionReminder', msg)
        io.to(obj.therapist).emit('endSessionReminder', obj.message)
    })
    socket.on('sessionStart', function(obj){
        //io.emit('sessionStart', obj)
        //notification to desitned therapist
        console.log(obj.appointment.therapist +' session start')
        io.to(obj.appointment.therapist).emit('sessionStart', obj)
    })
    socket.on('therapistChanged', function(data){
        io.emit('therapistChanged', data)
        console.log(data)
    })
    socket.on('broadcast', function(message){
        io.emit('broadcast', message)
        console.log(message)
    })
});



mongoose.connect(configs.mongodb).then(() => {
    http.listen(configs.port, () => {
        console.log('listening on ' + configs.port) 
    });
}).catch((err) => {
    console.log(err)
})