const Swiss = require('../models/SwissRoundModel')

exports.update_scores = function(contest_id, round){
    // add up the scores from previous round only
    // will be called only for round>=2

    return new Promise((resolve, reject)=>{
        Swiss.findOne({contest: contest_id})
        .then(async doc=>{
            // for round-2 (0-based)
            for(let [player, stat] of doc.results[round-2].table){
                const prev_score = doc.results[round-2].table.get(player).score;
                doc.results[round-1].table.get(player).score+=prev_score;         // add previous score to this score
            }     
            
            try {
                const updated_doc = await Swiss.findOneAndUpdate({ contest: contest_id }, doc, { new: true });
                // console.log(updated_doc);
                resolve(updated_doc);
            } catch (er) {
                console.log(er);
                reject(er);
            }
        })
        .catch(er=>{
            console.log(er)
            reject(er)
        })
    })
}