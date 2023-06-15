const mongoose = require('mongoose')

const ContestSchema = new mongoose.Schema({
    cnt:{
        type: Number
    },
    type:{
        type: String            // knockout / swiss / round-robin
    }, 
    title:{
        type: String
    },
    start_time:{
        type: Date
    },
    end_time:{
        type: Date
    },
    rounds:{
        type: Number          // total rounds 
    },
    next_round:{
        type: Number           // next round to be played
    },
    description:{
        type: String
    },
    rules:{
        type: String
    },
    scoring:{
        type: String
    },
    challenges_list:[{
        type: Number                // cnt attr
    }],
    owner:{
        type: String
    },
    moderators:[{
        type: String
    }],
    participants:[{
        type: String
    }],
    announcements:[{
        type: String
    }]
})


module.exports = mongoose.model('Contest', ContestSchema)


/*
KNOCKOUT process
-> create a new collection based on the _id of the contest
-> this collection will contain results of each round for this contest only
-> each doc will contain a result of one round
-> no. of docs in this collection will be equal to the no. of rounds in that contest
-> format for a result of a round: 
    -> {
        round: <round_no>
        results:[
            {   // player1 V/S player2
                player1: <player1name>        // username
                player2: <player2name>          // can be 'none' in case of bye (odd number of participants)
                winner: <nameofthewinner>
            },
            {
                ...
                ...
                ...
            },
            .
            .
            .
        ]
    }



    ------------------------------

ROUND-ROBIN process








-------------------------------
SWISS process








*/