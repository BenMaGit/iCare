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
        io.emit('reminder', appt)
    }else{
        console.log('no appointment')
    }
}

setInterval(appointmentReminder, 1000 * 10)



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use('/', router)

//Web messaging Api
app.post('/lineSend', (req, res)=>{
    let lineObj = req.body
    console.log(req.body.message)
    io.emit('lineSent', lineObj)
    res.json({msg: 'success'})
})
//testing
app.post('/webSend', (req, res)=>{
    let webObj = req.body
    io.emit('webSent', webObj)
    res.json({msg: 'success'})
})

io.on('connection', function(socket){
    socket.on('lineSent', function(obj){
        console.log(obj.message)
        io.emit('lineSent', obj);
      });
    socket.on('webSent', function(obj){
        console.log(obj.message)
        io.emit('webSent', obj)
    })
    socket.on('endSessionNotice', function(obj){
        console.log('Session End')
        io.emit('endSessionNotice', obj)
    })
    socket.on('endSessionReminder', function(msg){
        console.log(msg)
        io.emit('endSessionReminder', msg)
    })
    socket.on('sessionStart', function(userId){
        console.log(userId)
        io.emit('sessionStart', userId)
    })
  });

mongoose.connect(configs.mongodb).then(() => {
    http.listen(configs.port, () => {
        console.log('listening on ' + configs.port) 
    });
}).catch((err) => {
    console.log(err)
})