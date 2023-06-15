const Swiss = require('../models/SwissRoundModel');
const { update } = require('../models/contestModel');


exports.median_buchholz= function(contest_id, round){
    // sum of all opponents scores excluding highest and lowest

    return new Promise((resolve, reject)=>{

        Swiss.findOne({contest: contest_id})
        .then(async doc=>{
            // add opponents score excluding highest and lowest score
            const len = doc.results[0].table.size;        // total participants
            for(let [player, stat] of doc.results[round-1].table){
                const opponents = doc.results[round-1].table.get(player).opponents;           // list of opponents till this round
                let highest=Number.NEGATIVE_INFINITY, lowest=Number.POSITIVE_INFINITY;
    
                let oppo_score=0;
                for(let k=0; k<opponents.length; k++){          // only for this round
                    const op_score = doc.results[round-1].table.get(opponents[k].opp).score;
                    oppo_score+= op_score;
                    lowest = Math.min(op_score, lowest);
                    highest = Math.max(op_score, highest);
                }
    
                if(round>2) oppo_score-=(lowest+highest);       // only for rounds greater than 3 
    
                console.log("MBH for", player, ":", oppo_score) 
                doc.results[round-1].table.get(player).median_buchholz = oppo_score;             // updating the doc
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