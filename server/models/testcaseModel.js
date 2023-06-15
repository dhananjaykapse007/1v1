const mongoose = require('mongoose')

const TestCaseSchema = new mongoose.Schema({
    cnt:{
        type: Number,
    },
    input:{
        type: String,
        // required: true
    },
    output:{
        type: String,
        // required: true
    },
    explanation:{
        type: String, 
        default: ''
    }
})


module.exports = mongoose.model('TestCase', TestCaseSchema)