require('dotenv').config();
const assert= require('assert')

const express = require('express')
const cors = require('cors')
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session')
const db = require('./models/userModel')
const crypto = require('crypto')
const fs = require('fs')

const authRouters = require('./routes/auth.routes')
const challengeRouters = require('./routes/challenge.routes')
const contestRouters = require('./routes/contest.routes');
const { nextTick } = require('process');

const TestCase = require('./models/testcaseModel')

const app = express()
app.use(cors())
app.use(body_parser.urlencoded({extended:true}))
app.use(express.json())


// database connection
mongoose.connect(process.env.MONGO_URI, (err)=>{
    if(err) console.log("Error in connecting to the mongodb: ", err);
    else{
        console.log("Database connection formed");
        app.listen(process.env.PORT, ()=>{
            console.log("Server listening\nClick this link", `http://localhost:${process.env.PORT}`);
        })
    }
})




function shuffle(ar){
    const len = ar.length;
    for(let i=len-1; i>0; i--){
        let j = Math.floor(Math.random()*(i+1));
        [ar[i], ar[j]] = [ar[j], ar[i]];      // swap
    }

    return ar;
}



function getParticipants(contest_id){
    return new Promise((resolve, reject)=>{
        let participants;

        Swiss.findOne({cnt: contest_id})
        .then(p_round=>{
            participants = p_round.results[p_round.results.length-1].standings;
            resolve(participants)
        })
        .catch(error=>{
            reject(error)
        })
    })
}





function swiss_get_pairs(for_r, cnt){            // get pairs/matches for the rounds

    return new Promise((resolve, reject)=>{
        Contest.findOne({cnt: cnt})
        .then(async doc=>{
            let participants;
            
            if(for_r===1){
                participants = doc.participants;      
                participants = shuffle(participants);
                resolve(participants)
            }
            else{
                // from round 2 onwards...
                // fetch it from the 'standings' of the previous round (for_r-1)
                participants = await getParticipants(cnt)
                resolve(participants)
                // console.log('participants: ', participants)
            }
        })
        .catch(er=>{
            console.log(er);
            // return 'er'
            reject(er)
        })
    })
}






const Contest = require('./models/contestModel')
const Swiss = require('./models/SwissRoundModel')

const updateScore = require('./swiss_manager/updateScore')
const buchholz = require('./swiss_manager/buchholz')
const median_buchholz  = require('./swiss_manager/medianBuchholz')
const sonneborn_berger = require('./swiss_manager/sonnebornBerger')

const Agenda = require('agenda')
const agenda = new Agenda({db: {address: process.env.MONGO_URI, collection: 'agendaJobs'}});



async function pre_round(data){
    // data.round=1;
    // data.rounds = 4;       // total rounds in contest with cnt
    const cnt =1;         

    if(data.round > data.rounds){
        console.log('no more rounds')
        return 0; // success code
    }
    
    // 1. form pairings
    const pairings = await swiss_get_pairs(data.round, cnt);
    console.log('for pairings: ', pairings) ;         // can be - no more rounds, er, actual_pairings 
    
    
    // 2. insert into results.table field (basic structure - with opponents including previous)
    Swiss.findOne({contest: cnt}, async (er, swiss_res)=>{
        if(er){
            console.log(er)
        }
        else{
            swiss_res.results.push({            
                round: data.round,
                start_time: null,
                duration: 20,             // take this from the contest data
                table: new Map(),
                standings: new Array()
            })

            for(let i=0; i<pairings.length; i+=2){
                let obj_val = {              // key is the player name itself
                    score: 0.5,
                    opponents: new Array(),
                    sonneborn_berger: 0, 
                    median_buchholz: 0,
                    buchholz: 0
                };

                let obj_val2 = {
                    score: 0.5,
                    opponents: new Array(),
                    sonneborn_berger: 0, 
                    median_buchholz: 0,
                    buchholz: 0
                }

                if(data.round!=1){
                    obj_val.opponents = swiss_res.results[data.round-2].table.get(pairings[i]).opponents;       // getting opponent list from the previous round                        
                    obj_val2.opponents = swiss_res.results[data.round-2].table.get(pairings[i+1]).opponents;
                }

                obj_val.opponents.push({
                    opp: pairings[i+1],
                    result: ''                 // result pending
                })
                obj_val2.opponents.push({
                    opp: pairings[i],
                    result: ''
                })

                swiss_res.results[data.round-1].table.set(pairings[i], obj_val);
                swiss_res.results[data.round-1].table.set(pairings[i+1], obj_val2);
            }

            // insert it into the swiss_results
            swiss_res.save()
            .then(save_doc=>{
                console.log("new round saved")              
            })
            .catch(ee=>{
                console.log(ee)
            })
        }
    })
}

// async function live_round(){
//     // 1. live update score


//     // 2. announcements (if any)
// }


async function post_round(data){
    const cnt = 1;            // contest_id required for the contest, swiss_result
    // let data = {}
    // data.round=1          // this is internal working after round 1 for round 1 and in the last it will be incremented
    // data.rounds=4;
    
    // 1.update scores
    if(data.round>=2) {
        const temp = await updateScore.update_scores(cnt, data.round)
    }

    // 2. update tie-breakers
    const bh_results =  await buchholz.buchholz(cnt, data.round)         // first buchholz is the module and second one is its function
    const medbh_results=  await median_buchholz.median_buchholz(cnt, data.round);
    const sb_results = await sonneborn_berger.sonneborn_berger(cnt, data.round); 

    // 3. generate standings for the current round based on the current round table
    Swiss.findOne({contest: cnt})
    .then(async doc=>{
        if(data.round>data.rounds){// no need to add 
            console.log("All rounds are completed...")
        } 
        else{
            data.table = doc.results[data.round-1].table
            let standings = [...data.table.entries()].sort((p1, p2)=>{
                // console.log(p1[1].score, p2[1].score)             // p1 is the array [player, stat]

                if(p1[1].score!==p2[1].score) return p2[1].score-p1[1].score;
                if(p1[1].buchholz!==p2[1].buccholz) return p2[1].buccholz-p1[1].buccholz
                if(p1[1].median_buchholz!==p2[1].median_buchholz) return p2[1].median_buchholz-p1[1].median_buchholz
                return p2[1].sonneborn_berger-p1[1].sonneborn_berger
            })

            //save the standings for the current round
            standings = standings.map(([player, stat])=> player)
            doc.results[data.round-1].standings = standings
            await doc.save()
            .then(temp=>{
                console.log('standings: ', temp.results[data.round-1].standings)
            })
            .catch(temp_e=>{
                console.log(temp_e)
            })
            // console.log('standings: ', standings)
        }
    })
    .catch(er=>{
        console.log(er)
    })


    // 4. update round in job doc
    agenda.jobs(
        {'data.cnt': cnt}          // cnt is saved as a string (NaN)
    )
    .then(job=>{
        // console.log('jobs', job[0].attrs.data.cnt)
        job[0].attrs.data.round+=1
        
        job[0].save()
        .then(()=>{
            console.log("round incremented")
        })
        .catch(e=>{
            console.log(e)
        })
    })
    .catch(er=>{
        console.log(er)
    })
    



    // 4. update next_round in contest 
    // Contest.findOneAndUpdate({cnt: cnt},{$inc: {next_round: 1}}, {new:true})
    // .then(updated_doc=>{
    //     console.log('round incremented: ', updated_doc.next_round)
    // })
    // .catch(er=>{
    //     console.log(er)
    // })

}

let data ={
    rounds: 4,
    round:1,
    cnt: 1
}
 
// pre_round(data)      // before 1
// post_round(data)      // after 1
data.round=2
// pre_round(data)   // before 2
post_round(data)  // after 2
// data.round=3
// pre_round(data)     // before 3
// post_round(data)    // after 3
// data.round=4
// pre_round(data)    // before 4
// post_round(data)   // after 4
// data.round=5
// let val = pre_round(data)    // before 5
// val= post_round(data)     // after 5