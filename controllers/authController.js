const profileController = require('./profileController')
const Profile = require('../models/profile')
const jwt = require('jsonwebtoken');
const configs = require('../configs')

const auth = async (req, res, next) => {
    let token = req.query.token; 
    if(token){
        jwt.verify(token, configs.jwtSalt, (err, decoded) => {
            if(err){
                res.redirect(400, 'http://35.194.223.224/verifysuccess'+'?status='+"fail"+"&message=Invalid Token")
            }else{
                req.decoded = decoded;
                profileController.createProfile(req, res)
                //res.json({status: 200, res: 'verification success'+ JSON.stringify({email: decoded.email,name:decoded.name,lineID:decoded.lineID})});
            }
        })
    }else{
        res.redirect(400, 'http://35.194.223.224/verifysuccess'+'?status='+"fail"+"&message=Invalid Token")
    }
} 

module.exports ={
    auth,
}