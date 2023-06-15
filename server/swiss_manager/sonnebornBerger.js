const Swiss = require('../models/SwissRoundModel')


exports.sonneborn_berger = function(contest_id, round){
    // sum of all defeated opponents and half of each drawn opponent

    return new Promise((resolve, reject)=>{

        Swiss.findOne({contest: contest_id})
        .then(async doc=>{
            const len = doc.results[0].table.size;        // total participants
            for(let [player, stat] of doc.results[round-1].table){
                const opponents = doc.results[round-1].table.get(player).opponents;           // list of opponents till this round
    
                let oppo_score=0;
                for(let k=0; k<opponents.length; k++){          // only for this round
                    const op_score = doc.results[round-1].table.get(opponents[k].opp).score;
                    if(opponents[k].result === 'W') oppo_score+=op_score;
                    else if(opponents[k].result==='D') oppo_score+=(op_score/2);
                }
    
                console.log("SB for", player, ":", oppo_score) 
                doc.results[round-1].table.get(player).sonneborn_berger = oppo_score;             // updating the doc
            }
    
            try {
                const updated_doc = await Swiss.findOneAndUpdate({ contest: contest_id }, doc, { new: true });
                // console.log(updated_doc);
                resolve(updated_doc)
            } catch (er) {
                console.log(er);
                reject(er)
            }
    
        })
        .catch(er=>{
            console.log(er)
            reject(er)
        })

    })
}
