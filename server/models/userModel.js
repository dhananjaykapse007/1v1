const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    salt:{
        type:String,
        required: true
    },
    challenges:{
        type: Map,          // cnt, title
        of: String
    },
    contests:{
        type: Map,          // cnt, title
        of: String 
    }
})

module.exports = mongoose.model('User', UserSchema)