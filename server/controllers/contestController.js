const Agenda = require('agenda')

const Contest = require('../models/contestModel')
const Counts = require('../models/countsModel')
const User = require('../models/userModel')
const Swiss = require('../models/SwissRoundModel')

const updateScore = require('../swiss_manager/updateScore')
const buchholz = require('../swiss_manager/buchholz')
const median_buchholz  = require('../swiss_manager/medianBuchholz')
const sonneborn_berger = require('../swiss_manager/sonnebornBerger')

const swissJob = require('../jobs/swiss.job')
const sockets = require('../socketid_manager')


const agenda = new Agenda({db: {address: process.env.MONGO_URI, collection: 'agendaJobs'}});

agenda.define('pre_round', async (job)=>{
    // run the pre_round task
    swissJob.pre_round(job.attrs.data)
})

agenda.define('post_round', async(job)=>{
    // run the post_round task
    swissJob.post_round(job.attrs.data)
})








    // const socket = req.app.get('socket')    // for one connected client
    // const io = req.app.get('io')           // for all connected clients
    // socket.emit('oop', 'r234234')      // to one client 
    // io.emit(...)                    // to all connected clients






//POST/           // getting a list of past contests
exports.get_contests= function(req, res){
    console.log("Fetching list from user database")
    // needs user _id
    const user = req.body.owner

    User.findOne({username: user}, (err, docs)=>{
        if(err) {
            console.log('error in fetching contests from collection')
            res.json({
                message: 'failed'
            })
        }
        else{
            res.json({
                message: 'ok',
                data: docs           // send only contests list     
            })
        }
    })
}

//POST /contest/create           // creating a new contest
exports.create_contest= function(req, res){
    // console.log(req.body)

    // fetch count from doc
    Counts.findById(process.env.COUNT_ID, (err, doc)=>{
        if(err) console.log(err)
        else{
            doc.contest_count+=1
            doc.save()
            .then(response=>{
                const contest = new Contest({
                    cnt: doc.contest_count,
                    title: '',
                    type:'Swiss',            // temporary
                    start_time: '',
                    end_time: '',
                    rounds:0,
                    next_round: 1,
                    description: '',
                    rules: '',
                    scoring: '',
                    owner: req.body.owner,
                    challenges_list: new Array(),
                    participants: new Array()
                })
                contest.save()
                .then(result=>{
                    console.log(result) 

                    User.updateOne({username: req.body.owner},
                        {$set: {[`contests.${result.cnt}`]: contest.title}}, (err, user)=>{
                            if(err) console.log(err)
                            else console.log(user)
                        })
                    
                    // create a new collection for storing the results of this contest 
                    // also should know the type of contest (swiss, knockout, round-robin)
                    if(result.type==='Swiss'){
                        const swiss_contest_res = new Swiss({
                            contest: result.cnt,
                            results: new Array()
                        })

                        swiss_contest_res.save()
                        .then(swiss_res=>{
                            console.log('contest cnt: ', result.cnt)
                            res.json({
                                message: 'ok',
                                cnt: result.cnt       // cnt is the id of the newly created contest
                            })
                        })
                        .catch(er=>{
                            console.log(er);
                            res.json({
                                message: 'failed'
                            })
                        })

                    }
                })
                .catch(err=>{
                    console.log(err)
                    res.json({
                        message: 'failed'
                    })
                })
            })
            .catch(error=>{
                console.log('doc.contest_count not updated')
            })
        }
    })
}


//PUT /contest/:id/update
exports.update_contest_details = async function(req, res){
    const contest_id = req.params.id 
    const updated_doc = req.body.data        

    Contest.findOneAndUpdate({cnt: contest_id}, updated_doc, {new:true})
    .then(async updated_doc =>{
        // console.log('Update: ', updated_doc)
        //update title in the contests list of this user
        User.updateOne({username: req.body.owner},
            {$set: {[`contests.${updated_doc.cnt}`]: updated_doc.title}}, (err, user)=>{
                if(err) console.log(err)
                else console.log(user)
        })

        let _2minprior = new Date(updated_doc.start_time)
        _2minprior = (_2minprior.getTime() - 2*60*1000)         // 2min= 2*60*1000
        _2minprior = new Date(_2minprior)

        let _21minlater = new Date(updated_doc.start_time)
        _21minlater = (_21minlater.getTime() + 21*60*1000)       
        _21minlater = new Date(_21minlater)

        // deleting the previous jobs
        let num_doc = await agenda.cancel({'data.cnt': Number(contest_id)})      // deletes both pre_job and post_job
        console.log('deleted: ', num_doc)

        // creating new job 
        const pre_job = agenda.create('pre_round', 
            {
                cnt: Number(contest_id), 
                rounds: Number(updated_doc.rounds), 
                round: Number(1)
            }
        )  
        const post_job = agenda.create('post_round',
            {
                cnt: Number(contest_id),
                rounds: Number(updated_doc.rounds),
                round: Number(1)                  // after round 1
            }
        )
        
        pre_job.repeatEvery('30 minutes')      // running the job after every 30min 
        pre_job.schedule(_2minprior);
        pre_job.save()
        .then(()=>{
            console.log('pre_job for ', _2minprior)
            
            // post_job will be saved later (to maintain the ordering)
            post_job.repeatEvery('30 minutes')      // running the job after every 30min for number of rounds
            post_job.schedule(_21minlater);
            post_job.save()
            .then(()=>{
                console.log('post_job for ', _21minlater)
            })
            .catch(e=>{
                console.log(e)
            })
        })
        .catch(e=>{
            console.log(e)
        })
        
        res.json({
            message: 'ok',
            data: updated_doc
        })
    })
    .catch(err=>{
        console.log(err)
        res.json({
            message: 'failed'
        })
    })
}


//GET /contest/:id      // get details about a specific contest (auth required)
exports.get_contest_details = function(req, res){
    const contest_id = req.params.id      // id is the cnt attribute
    console.log(contest_id) 

    Contest.findOne({cnt: contest_id}, (err, contest_data)=>{
        if(err){
            console.log(err)
            res.json({
                message: err
            })
        }
        else {
            // console.log(contest_data)
            res.json({
                messsage: 'ok',
                body: contest_data
            })
        }
    })
}


//GET /contest/:id/delete
exports.delete_contest = function(req, res){
    const contest_id = req.params.id;       // id is the cnt attribute of the contest
    const user = req.body.user

    Contest.deleteOne({cnt: contest_id}, async (err, contest_data)=>{
        if(err){
            console.log(err);
            // remove it from the owner's account
            res.json({
                'message': err
            })
        }
        else{
            const user_doc = await User.findOne({username: user})
            // delete user_doc.contests[contest_id];         // deleting from map
            user_doc.contests.delete(contest_id)
            await user_doc.save()

            console.log('contest with id: ', contest_id, ' successfully deleted')
            res.json({
                'message': 'ok'
            })
        }
    })
}


// POST /contest/:id/register
exports.contest_registration= function(req, res){
    // need user details
    // need contest details
    const contest_id = req.params.id;
    const user = req.body.username

    Contest.findOne({cnt: contest_id})
    .then(async contest=>{
        const prev_val_rounds = contest.rounds           
        const total_participants = contest.participants.length +1;
        const rounds = Math.ceil(Math.log2(total_participants))
        
        return Contest.findOneAndUpdate({cnt: contest_id},
            {
                $addToSet:{participants: user}, $set: {rounds: rounds}
            }, 
            {new:true}
        )
        .then(response=>{
            console.log(response)

            if(prev_val_rounds != rounds){          // updating the total rounds in jobs documents
                agenda.jobs(
                    {'data.cnt' : cnt}
                )
                .then(job=>{
                    job[0].attrs.data.rounds = rounds         // pre_round
                    job[0].attrs.repeatLimit = rounds         // no. of times to be repeated
                    job[1].attrs.data.rounds = rounds         // post_round
                    job[1].attrs.repeatLimit = rounds
                })
                .catch(errr=>{
                    console.log(errr)
                })
            }
            res.json({
                message:'ok'
            })
        })
    })
}


// POST /contest/id/announce
exports.make_announcement = function(req, res){
    const announcement = req.body.announcement;

    Contest.findOneAndUpdate({cnt: req.params.id}, 
        {
            $push : {announcements: announcement}
        },
        {new: true}
    )
    .then(new_doc=>{
        // console.log(new_doc.announcements)
        // also push this notification via socket connection
        sockets.notifyAll(new_doc.participants, 'announcement', announcement) ;       // first one is the group , and second one is the message 

        res.json({
            'message': 'ok'
        })
    })
    .catch(er=>{
        console.log(er)
    })
}


exports.add_moderator_for_contest = function(req, res){
    const mod = req.body.moderator;

    Contest.findOneAndUpdate({cnt: req.params.id}, 
        {
            $addToSet: {moderators: mod}   
        },
        {new: true}
    )
    .then(response=>{
        console.log(response)
        res.json({
            'message': 'ok'
        })
    })
    .catch(er=>{
        console.log(er)
        res.json({
            'message': 'failed'
        })
    })
}


exports.remove_moderator_from_contest = function(req, res){
    const mod = req.body.moderator;

    Contest.findOneAndUpdate({cnt: req.params.id}, 
        {
            $pull: {moderators: mod}   
        },
        {new: true}
    )
    .then(response=>{
        console.log(response)
        res.json({
            'message': 'ok'
        })
    })
    .catch(er=>{
        console.log(er)
        res.json({
            'message': 'failed'
        })
    })
}



exports.add_challenge_to_contest = function(req, res){
    const user = req.body.owner
    const challenge_cnt = req.body.cnt_id
    const challenge_title = req.body.challenge_title
    
    Contest.findOneAndUpdate({cnt: req.params.id}, {$addToSet: {challenges_list: challenge_cnt}}, (err, contest)=>{
            if(err){
                console.log(err)
                res.json({
                    message: 'failed'
                })
            }
            else{
                console.log(contest)
                res.json({
                    message: 'ok'
                })
            }
        })

}


exports.remove_challenge_from_contest = function(req, res){
    const ch_id = req.body.challenge_id;
    
    Contest.findOneAndUpdate({cnt: req.params.id}, 
        {
            $pull: {challenges_list: ch_id}
        },
        {new: true}
    )
    .then(response=>{
        console.log(response)
        res.json({
            'message': 'ok'
        })
    })  
    .catch(er=>{
        console.log(er)
        res.json({
            'message': 'failed'
        })
    })
}


exports.remove_participant= function(req, res){
    const participant = req.body.participant
    
    Contest.updateOne({cnt: req.params.id}, {$pull: {participants: participant}})
    .then(updated_doc=>{
        // console.log(updated_doc)
        res.json({
            'message': 'ok'
        })
    })
    .catch(err=>{
        console.log(err)
        res.json({
            'message': 'failed'
        })
    })

}


exports.get_next_round = function(req, res){      // fetchng next round from the jobs (from post_job)

    agenda.jobs({'data.cnt': Number(req.params.id)})
    .then(job=>{
        let next_round = 1
        if(job.length) next_round = job[1].attrs.data.round
        // console.log('next-round', next_round)
        res.json({
            'message': 'ok',
            'next_round': next_round
        })
    })
    .catch(er=>{
        console.log(er)
        res.json({
            'message': 'failed',
            'next_round': -2
        })
    })
}


exports.get_results = function(req, res){
    // fetch the results from the Swiss model for this contest
    Swiss.findOne({contest: req.params.id}, (er, result)=>{
        if(er){
            console.log(er)
            res.json({
                'message': 'failed'
            })
        }
        else{
            // console.log(result.results)
            res.json({
                'message': 'ok',
                'results': result.results          // sending only the info for rounds as an array (and not the entire data)
            })
        }
    })
}


exports.submit_ac = function(req, res){
    const participant = req.body.username
    const submissionTime= req.body.submissionTime
    const contest = req.params.id;
    const round = req.params.round

    // console.log('adsf', participant, submissionTime, contest, round)

    Swiss.findOne({contest: contest}, async (er, doc)=>{
        if(er){
            console.log(er)
            res.json({
                'message': 'failed to save the AC status to the db'
            })
        }
        else{
            const table = doc.results[round-1].table
            const opp = table.get(participant).opponents[round-1].opp
            const result = table.get(participant).opponents[round-1].result

            if(result==='D'){
                doc.results[round-1].table.get(participant).opponents[round-1].result='W';       // this participant won the round
                doc.results[round-1].table.get(opp).opponents[round-1].result = 'L';         // opponent lost the round
                
                //update the score (+1)
                doc.results[round-1].table.get(participant).score+=1.0;

                Swiss.updateOne({contest: contest}, doc)
                .then(()=>{
                    console.log(participant, 'won the round')
                    const _socket = sockets.getSocket(participant)
                    if(_socket!=-1) _socket.emit('get-result', 'You won the round!!')
                    else console.log("no _socket")

                    const socket = sockets.getSocket(opp)
                    if(socket!=-1) socket.emit('get-result', `Your opponent ${participant} won the round.`)
                    console.log('no socket')
                })
                .catch(er=>{
                    console.log(er)
                })
            }
            else if(result==='L'){
                console.log("opponent already won the round!")
            }   
        }
    })
}



//- --------- --------- ------- ------- ------ -------



agenda.start();