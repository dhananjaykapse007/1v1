const mongoose = require('mongoose')

const CountSchema = new mongoose.Schema({
    contest_count:{
        type: Number
    },
    challenge_count:{
        type: Number
    },
    user_count:{
        type: Number
    },
    test_case_count:{
        type: Number
    }
});

module.exports = mongoose.model('Counts', CountSchema);