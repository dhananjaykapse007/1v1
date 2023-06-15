const mongoose = require('mongoose')


const ChallengeSchema = new mongoose.Schema({
    cnt:{
        type: Number
    },
    owner:{
        type: String
    },
    title:{
        type: String
    },
    statement:{
        type: String
    },
    constraints:{
        type: String
    },
    input_format:{
        type: String
    },
    output_format:{
        type: String
    },
    sample_test_cases:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestCase'
    }],
    hidden_test_cases:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestCase'
    }],
    moderators:[{
        type: String
    }]
})


module.exports = mongoose.model('Challenge', ChallengeSchema)