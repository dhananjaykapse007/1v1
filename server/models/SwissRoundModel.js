const mongoose = require('mongoose')

const SwissRoundSchema = new mongoose.Schema({
    contest:{
        type: Number            // cnt of the contest
    },
    results:[{
        round:{                      // round number
            type: Number
        },
        isDone:{                    // round is completed or not
            type: Boolean
        },
        start_time:{
            type: Date
        }, 
        duration: {
            type: Number             // in minutes
        }, 
        table:{
            type: Map,                 // player:  { ... }
            of: Object           // {score, tb1, tb2, tb3...}
        },
        standings:{              // standings upto this round
            type: Array
        }    
    }]
});

module.exports = mongoose.model('Swiss_Results', SwissRoundSchema);



/*
each contest will have only one document which will contain the results for all of the rounds for that contest in the form of array of objects

as an example:

const swiss_res = new SwissResult({
        contest: 234,
        results:[
            {
                round: 1,
                start_time: '',
                duration: 20,
                matches:[
                    {
                        player1: 'abc',
                        player2: 'def',
                        winner: 'abc'
                    },
                    {
                        player1: 'abc',
                        player2: 'def',
                        winner: 'abc'
                    }
                ],
                table:[
                    {
                        player: 'abc',
                        score: 3,
                        opponents: [],          // including this rounds    (array of strings(usernames))
                        sonneborn_berger: 12,
                        median_buchholz: 13,
                        buchholz: 22
                    },
                    {
                        player: 'def',
                        score: 2,
                        opponents: [],
                        sonneborn_berger: 10,
                        median_buchholz: 12,
                        buchholz: 18
                    }
                ]
            },
            {
                round: 1,
                start_time: '',
                duration: 20,
                matches:[
                    {
                        player1: 'abc',
                        player2: 'def',
                        winner: 'abc'
                    },
                    {
                        player1: 'abc',
                        player2: 'def',
                        winner: 'abc'
                    }
                ],
                table:[
                    {
                        player: 'abc',
                        score: 3,
                        opponents: [],             // array of objects -> {opponent: '', result: 'W/D/L'}       // Win Draw Lose  -- for this current person)
                        sonneborn_berger: 12,
                        median_buchholz: 13,
                        buchholz: 22
                    },
                    {
                        player: 'def',
                        score: 2,
                        opponents: [],
                        sonneborn_berger: 10,
                        median_buchholz: 12,
                        buchholz: 18
                    }
                ]
            }
        ]
    });

    swiss_res.save()
    .then(response=>{
        console.log(response);
    })
    .catch(err=>{
        console.log(err)
    })

*/