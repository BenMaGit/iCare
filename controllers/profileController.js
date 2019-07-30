const Profile = require('../models/profile')
const configs = require('../configs')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const Appointment = require('../models/appointment')

//email pattern
const emailPattern = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/

async function register (req, res, next){
    let name = req.body.name
    let email = req.body.email
    let userId = req.body.lineID
    let date = req.body.date
    let time = req.body.time
    let topic = req.body.topic
    console.log(userId+ "register ID")
    let existed = await Profile.findbyEmail(email)
    
    if(existed){
        console.log("existed")
        res.json({status: 543, msg:"此Email已被註冊過"})
        return;
    }

    if(!emailPattern.test(email)){  //不符合格式的話就return     //用這個方法會回傳0 or -1email.search(emailRule)
        res.json({status: 400, msg: 'email格式不符合'});
        return;
    }
    //authentication mailer
    let mailTransport = nodemailer.createTransport( {
        service: 'Gmail',
        auth: {
          user: 'icare1314@gmail.com',
          pass: 'icareicare76'
        }
      });
    //
    //encrypt
    let token = jwt.sign({ email: email, name: name, lineID: userId, date: date, time: time, topic: topic}, configs.jwtSalt, {expiresIn: 60 * 60})
    //生成信件裡的Api path 
    let url = 'http://35.194.253.53:3000/user/auth'+'?token='+token
    
    //信件主旨,內容
    let options = {
        //寄件者
        from: '"iCare ❤️❤️❤️" <icare1314@gmail.com>',     //'icare1314@gmail.com',
        //收件者
        to: email,  
        //副本
        cc: '',
        //密件副本
        bcc: '',
        //主旨
        subject: 'iCare 認證信件', // Subject line
        //純文字
        text: name + ',' + '您好！\n\n請點擊以下網址以啟用您的帳戶\n(注意: 網址在24小時後即失效)\n\n '+url, // plaintext body
    };
    //Send email
    mailTransport.sendMail(options, function(error, info){
        if(error){
            console.log(error);
            res.json({status: 400, msg: error});
        }else{
            console.log('訊息發送: ' + info.response);
            res.json({status: 200, msg: '驗證信寄出'});
        }
    });
}
async function createProfile(req, res, next){
    let user = req.decoded;
    let name = user.name;
    let email = user.email;
    let userId = user.lineID;
    let date = user.date;
    let time = user.time;
    let topic = user.topic
    console.log(topic+'TOPIC')
    let registrationDate = new Date().toLocaleDateString()
    let existed = await Profile.findbyEmail(email)
    
    if(existed){
        console.log("DoubleClicked")
        res.redirect(400, 'http://35.194.223.224/verifysuccess'+'?status='+"fail"+"&message=Account already existed")
        return;
    }
    if(!userId || !email || !name){
        res.json({status: 502, msg: 'Missing Information'})
    }else{
        let newProfile = new Profile({
            name: name,
            email: email,
            userID: userId,
            registrationDate: registrationDate
        })
        //create profile and make appointment
        newProfile.save().then(()=>{
            let appointment = new Appointment({
                profile: newProfile,
                date: date,
                time: time,
                topic: topic
            })
            appointment.save().then(()=>{
                res.redirect(301, 'http://35.194.223.224/verifysuccess?status=success' + '&date=' + encodeURIComponent(date) + '&time=' + encodeURIComponent(time))
            })
        })
    }
}

module.exports = {
        register,
        createProfile 
    }