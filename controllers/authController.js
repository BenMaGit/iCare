const profileController = require('./profileController')
const jwt = require('jsonwebtoken');
const configs = require('../configs')
const Faculty = require('../models/faculty'); 


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

const getToken = async(req,res,next) => {
    let account = req.body.account;
    let password = req.body.password;
    let type = req.body.type;
    console.log(account)
    console.log(password)
    console.log(type)
    
    let faculty = await Faculty.authenticate(account,password,type);  //這三行可以不用 好像還是要
    console.log('Faculty Profile: ' + faculty)

    if(!faculty){
        res.json({status:400, msg:'該身分無此帳號'})
        return;
    }else{
        var token = jwt.sign({account: faculty.account, password: faculty.password}, configs.jwtSalt, {expiresIn: 60*60*4});
        res.json( { status: 200, msg:{token: token, type: faculty.type, name:faculty.name} } );
        console.log("教職員: "+ faculty +" 取得TOKEN: "+ token )

    }
   

    /* Faculty.findOne({account:account, password:password, type:type}, (err, faculty) => {
        if(err){   //甚麼狀況下會err?
            //response(err, null, res);
            res.json({status:400, msg:'ERR'})
            return;
        }
        if(!faculty){
            //response(errorHandler.IWALID_USERNAME, null, res);
            res.json({status:400, msg:'該身分無此帳號'})
            return;
        }
        
        var token = jwt.sign({account: faculty.account, password: faculty.password}, configs.jwtSalt, {expiresIn: 60*60*4});
        res.json( { status: 200, msg:{token: token, type: facultyType, name:facultyName} } );
        console.log("教職員: "+ faculty +" 取得TOKEN: "+ token )
        //response(null, token, res);
    }); */

   
}

const checkToken = (req,res,next) => {
    let token = req.headers['x-access-token'];  //這個在實際狀況是怎麼運用的?

    if(token){
        jwt.verify(token, configs.jwtSalt,(err, decoded) => {
            if(err){
                //response(errorHandler.INVALID_ACCESS_TOKEN, null, res);
                res.json({status:400 , msg:'無效的token'});
                return;
            }else{
                req.decoded = decoded; //{userId: user._id}
                console.log(req.decoded)
                next();
            }
        });
    }else{
        //response(errorHandler.PERMISSION_DENIED, null, res);
        res.json({status:400 , msg:'沒有Token'});
        return;
    }

}
module.exports ={
    auth,
    getToken,
    checkToken
}