
const Contest = require('../models/contestModel')
const Swiss = require('../models/SwissRoundModel')
// const sockets = require('../socketid_manager')        // to get the socketIds of the participants

const updateScore = require('../swiss_manager/updateScore')
const buchholz = require('../swiss_manager/buchholz')
const median_buchholz  = require('../swiss_manager/medianBuchholz')
const sonneborn_berger = require('../swiss_manager/sonnebornBerger')

const Agenda = require('agenda')
const agenda = new Agenda({db: {address: process.env.MONGO_URI, collection: 'agendaJobs'}});


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


// once run, increment the round (getting prepared for the next round)
function jobUpdate(which, cnt){        // which = 0 -> pre_job   1-> post_job
    
    agenda.jobs(
        {'data.cnt': cnt}
    )
    .then(job=>{
            job[which].attrs.data.round+=1
            job[which].save()
            .then(()=>{
                console.log('round incremented for ', which)
            })
            .catch(()=>{
                console.log('couldnot increment the round for ', which)
            })
    })
    .catch(er=>{
        console.log(er)
    })
}

// destroy job for both pre_job and post_job after all rounds completion
async function jobDestroy(cnt){
    let jobs = await agenda.cancel({'data.cnt': Number(cnt)})
    console.log("both jobs destroyed")
}


exports.pre_round = async function(data){
    const cnt =data.cnt;        
    if(data.round > data.rounds){
        console.log('no more rounds')
        // this job will be destroyed after the post_round
        return 0; // success code
    }
    
    try{
        
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
                    isDone: false,
                    start_time: null,
                    duration: 20,             // take this from the contest data
                    table: new Map(),
                    standings: new Array()
                })
    
                for(let i=0; i<pairings.length; i+=2){
                    let obj_val = {              // key is the player name itself
                        score: 0.0,
                        opponents: new Array(),
                        sonneborn_berger: 0, 
                        median_buchholz: 0,
                        buchholz: 0
                    };
    
                    let obj_val2 = {
                        score: 0.0,
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
                        result: 'D'                 
                    })
                    obj_val2.opponents.push({
                        opp: pairings[i],
                        result: 'D'
                    })
                    
                    // just to maintain the order of inserting the data into table
                    await swiss_res.results[data.round-1].table.set(pairings[i], obj_val);
                    await swiss_res.results[data.round-1].table.set(pairings[i+1], obj_val2);
                }
    
                // insert it into the swiss_results
                swiss_res.save()
                .then(saved_doc=>{
                    console.log("new round saved")   

                    // notify the participants to get their opponent
                    // const table = saved_doc.results[data.round-1].table
                    // for(let [player, stat] of table){
                    //     const opp = table.get(player).opponents.slice(-1)[0]
                    //     // console.log(player, opp.opp)
                    //     const socket = sockets.getSocket(player)
                    //     if(socket===-1) continue
                    //     socket.emit('get-opponent', {
                    //         opp: opp.opp
                    //     })
                    // }
                })
                .catch(ee=>{
                    console.log(ee)
                })
            }
        })
    
        // also update the round 
        if(data.round<=data.rounds) jobUpdate(0, cnt)

    }catch(er){
        console.log('error in pre_round')
    }
}
    

exports.post_round= async function(data){
    const cnt = data.cnt

    try{
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
                doc.results[data.round-1].isDone =true;           // round is completed
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

                    // destroy the jobs after the last round
                    if(data.round == data.rounds){
                        console.log('no more rounds')
                
                        // destroy the job 
                        jobDestroy(cnt)
                        return 0; // success code
                    }       

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
        if(data.round < data.rounds) jobUpdate(1, cnt)      // not for the last round

    }catch(e){
        console.log('error in post_round')
    }
}
