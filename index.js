const express = require('express');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const router = require('./routes')
const mongoose = require('mongoose')
const configs = require('./configs')
const bodyParser = require('body-parser')


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
        io.emit('lineSent', obj);
      });
    socket.on('webSent', function(obj){
        console.log(obj.message)
        io.emit('webSent', obj)
    })
  });

mongoose.connect(configs.mongodb).then(() => {
    http.listen(configs.port, () => {
        console.log('listening on ' + configs.port) 
    });
}).catch((err) => {
    console.log(err)
})