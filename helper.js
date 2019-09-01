const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next)=>{
    let publicKey = fs.readFileSync(path.join(__dirname, 'token/public.key'));
    let token, subject;
    
    if(req.method == 'GET'){
        if(req.query && req.query.token){
            subject = req.query.subject;
            token = req.query.token;
        }else{
            res.json({
                success: false,
                msg: "No token"
            });
        }
    }else{
        if(req.body && req.body.token){
            subject = req.body.subject;
            token = req.body.token;
        }else{
            res.json({
                success: false,
                msg: "No token"
            });
        }
    }
    let option = {
        issuer: "Batch",
        subject: subject,
        audience: subject,
        expiresIn: '12h',
        algorithm: 'RS256'
        }
    jwt.verify(token, publicKey, option, (err, decode)=>{
        if(err){
            res.json({
                success: false,
                msg: "Invaild token"
            })
        }else{
            if(req.method == 'GET'){
                delete req.query.token;
                delete req.query.subject;
            }else{
                delete req.body.token;
                delete req.body.subject;
            }
            next();
        }
    });
}


module.exports = {verifyToken};





