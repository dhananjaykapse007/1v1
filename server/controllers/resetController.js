const Counts = require('../models/countsModel')
const Challenges = require('../models/challengeModel')
const Contests = require('../models/contestModel')
const TestCases = require('../models/testcaseModel')
const Users = require('../models/userModel')


function counts_reset(){
    Counts.findOne({cnt: process.env.COUNT_ID}, (err, doc)=>{
        if(err) console.log(err)
        else{
            doc.contest_count=0
            doc.challenge_count=0
            doc.user_count=0
            doc.test_case_count=0
            doc.save()
            .then(response=>{
                console.log('counts reset successful')
            })
            .catch(error=>{
                console.log('counts reset failed')
            })
        }
    })
}

function challenges_reset(){
    Challenges.deleteMany({})
    .then(response=>{
        console.log("challenges reset successful")
    })
    .catch(err=>{
        console.log('challenges reset failed')
    })
}

function contests_reset(){
    Contests.deleteMany({})
    .then(response=>{
        console.log("contests reset successful")
    })
    .catch(err=>{
        console.log('contests reset failed')
    })
}

function testcases_reset(){
    TestCases.deleteMany({})
    .then(response=>{
        console.log("testcases reset successful")
    })
    .catch(err=>{
        console.log('testcases reset failed')
    })
}

function users_reset(){
    Users.deleteMany({})
    .then(response=>{
        console.log("users reset successful")
    })
    .catch(err=>{
        console.log('users reset failed')
    })
}


//GET /
exports.reset = function(req, res){
    counts_reset()
    challenges_reset()
    users_reset()
    contests_reset()
    testcases_reset()

    res.json({
        message: 'ok'
    })
}
