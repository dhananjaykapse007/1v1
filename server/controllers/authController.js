const User = require('../models/userModel')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

exports.signin = function(req, res){
    // console.log(req.body)
    let hashed = crypto.pbkdf2Sync(req.body.password, process.env.SALT, 1000, 64, 'sha512').toString('hex')

    User.findOne({username:req.body.username}, async (err, user)=>{
        if(!user){
            res.send({
                message:'failed',
                data: 'user not found'
            })
        }
        else if(err){
            console.log(err)
            res.json({
                message:'failed'
            })
        }
        else{
            if(hashed===user.password){
                // auth successful
                const token = jwt.sign({ username: user.username }, process.env.PRIVATE_KEY, { expiresIn: '1h' })
                res.send({
                    message:'ok',
                    token: token, 
                    username: user.username
                })
            }
            else{
                res.json({
                    message:'failed',
                    data: 'invalid password'
                })
            }
        }
    })
}

exports.signup = function(req, res){
    // hash the password

    let hashed = crypto.pbkdf2Sync(req.body.password, process.env.SALT, 1000, 64, 'sha512').toString('hex')

    const user = new User({
        username: req.body.username,
        password: hashed,
        email: req.body.email,
        salt: process.env.SALT,
        challenges: new Map(),
        contests: new Map()
    })

    user.save()
    .then(result=>{
        res.json({
            message: 'ok'
        })
    })
    .catch(err=>{
        res.json({
            message: err
        })
    })
}


// exports.signout = (req,res) => {
//     console.log(req)

//     const bearerHeader = req.headers['Authorization']

//     if(typeof bearerHeader!=='undefined'){
//       const bearerToken = bearerHeader.split(' ')[1]
//       console.log(bearerHeader, bearerToken)
//       jwt.destroy(bearerToken)
//       res.status(200).json({
//           message: 'user signed out successfully'
//       })
//     }
// }
  

exports.verifyToken = (req,res, next)=>{
    req.user = {username:null, verified:false}
    const privateKey = process.env.PRIVATE_KEY
    const bearerHeader = req.headers['Authorization']
    if(typeof bearerHeader!=='undefined') {
      const bearerToken = bearerHeader.split(' ')[1]
      jwt.verify(bearerToken, privateKey, function (err,data){
        if(! (err && typeof data=== 'undefined')) {
          req.user = {username:data.username, verified:true}
          next()}
      })
    }
    return res.sendStatus(403)
}

// exports.updatePassword = async (req, res)=>{
   // https://medium.com/@vrinmkansal/quickstart-jwt-based-login-for-react-express-app-eebf4ea9cfe8
// }
