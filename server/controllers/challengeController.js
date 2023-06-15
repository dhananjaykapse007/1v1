const Challenge = require('../models/challengeModel')
const Counts = require('../models/countsModel')
const TestCase = require('../models/testcaseModel')
const User = require('../models/userModel')
const Contest = require('../models/contestModel')
const path = require('path')
const fs = require('fs')
const axios = require('axios')

const headers = {
    'Content-Type': 'application/json',
    'client-secret': process.env.CODE_CLIENT_SECRET
};

//POST  /challenges
exports.user_challenges = function(req, res){
    // fetch the list of all challenges from the user's data

    User.findOne({username: req.body.owner}, (err, doc)=>{          // getting all the docs from the collection
        if(err) console.log(err)
        else{
            res.json({
                message: 'ok',
                data: doc
            })
        }
    })
}


exports.contest_challenges= function(req, res){
    // fetch the list of all challenges from the contest's data
    const contest_id = req.body.contest_id

    Contest.findOne({cnt: contest_id}, (err, doc)=>{
        if(err) console.log(err)
        else{
            //fetch the titles of these challenges to forward to client
            let challenges = doc.challenges_list
            let challenges_title = []

            Promise.all(challenges.map((challenge) => {
                return Challenge.findOne({ cnt: challenge }).exec();
            }))
            .then((challengeDocs) => {
                console.log('sfsdfsdfsd', challengeDocs);
                
                const challenges_title = challengeDocs.map((challenge) => {
                    return {
                        cnt: challenge.cnt,
                        title: challenge.title
                    }
                });
                res.json({
                    message: 'ok',
                    data: challenges_title
                });
            })
            .catch((err) => {
                console.log(err)
                res.json({
                    message: 'failed'
                })
            });
              
        }
    })
}


//POST /challenges/create
exports.create_challenge = async function(req, res){
    // console.log(req.body)

    Counts.findById(process.env.COUNT_ID, (err, doc)=>{
        if(err) console.log(err)
        else{
            doc.challenge_count+=1
            doc.save()
            .then(response=>{
                const challenge = new Challenge({
                    cnt: doc.challenge_count,
                    owner: req.body.owner,
                    title:'',
                    statement:'',
                    constraints:'',
                    input_format:'',
                    output_format:'',
                    sample_test_cases: new Array(), 
                    hidden_test_cases: new Array(),
                    moderators: new Array()
                })
                challenge.save()
                .then(result=>{
                    console.log(result)
                    User.updateOne({username: req.body.owner},
                                    {$set: {[`challenges.${result.cnt}`]: challenge.title}}, (err, user)=>{
                                        if(err) console.log(err)
                                        else console.log(user)
                                    })
                    res.json({
                        message: 'ok',
                        cnt: result.cnt
                    })
                })
                .catch(err=>{
                    console.log(err)
                    res.json({
                        message: err
                    })
                })
            })
            .catch(error=>{
                console.log('doc.challenge_count not updated')
            })
        }
    })
}


//PUT /challenges/:id/update
exports.update_challenge_details = function(req, res){
    const challenge_id = req.params.id;
    const to_update = req.body.data 

    Challenge.findOneAndUpdate({cnt: challenge_id}, to_update, {new:true})
    .then(updated_doc=>{
        console.log('Update: ', updated_doc)
        // update title in the challenges list of this user
        User.updateOne({username: req.body.owner},
            {$set: {[`challenges.${updated_doc.cnt}`]: updated_doc.title}}, (err, user)=>{
                if(err) console.log(err)
                else console.log(user)
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


async function get_tc_details(challenge_data){
    try{
        let total_sample_cases = challenge_data.sample_test_cases.length
        let total_hidden_cases = challenge_data.hidden_test_cases.length
        const sample_promises = []
        const hidden_promises = []
    
        for(let i=0; i<total_sample_cases; i++){
            sample_promises.push(TestCase.findById(challenge_data.sample_test_cases[i]))
        }
        for(let i=0; i<total_hidden_cases; i++){
            hidden_promises.push(TestCase.findById(challenge_data.hidden_test_cases[i]))
        }

        const sample_results = await Promise.all(sample_promises)
        const hidden_results = await Promise.all(hidden_promises)

        const sample_tc_data = sample_results.map(result=>{
            return {
                input: result.input,
                output: result.output,
                explanation: result.explanation
            }
        })

        const hidden_tc_data = hidden_results.map(result=>{
            return{
                input: result.input, 
                output: result.output
            }
        })

        return {
            samples: sample_tc_data,
            hiddens: hidden_tc_data
        }
    }
    catch(error){
        throw new Error("failed")
    }

}


//GET /challenges/:id
exports.get_challenge_details = function(req, res){
    const challenge_id = req.params.id;
    console.log("request received for challenge: ", challenge_id)

    Challenge.findOne({cnt: challenge_id}, async (err, challenge_data)=>{
        if(err){
            console.log(err)
            res.json({
                message: err
            })
        }
        else if(!challenge_data){
            console.log('challenge not found')
            res.json({
                'message': 'not_found'
            })
        }
        else{
            // also include sample test cases in body
            let chal_data = {
                title: challenge_data.title,
                statement: challenge_data.statement,
                constraints: challenge_data.constraints,
                input_format: challenge_data.input_format,
                output_format: challenge_data.output_format,
                moderators: challenge_data.moderators
            }

            get_tc_details(challenge_data)
            .then(tc_data=>{
                if(tc_data=='failed') res.json({
                    message: 'failed'
                })
                else res.json({
                    message: 'ok',
                    challenge_details: chal_data,
                    sample_testcase_details: tc_data.samples,           // only sample test cases are sent
                    hidden_testcase_details: tc_data.hiddens
                })
            })
            .catch(err=>{
                console.log(err)
                res.json({
                    message: 'failed'
                })
            })
        }
    })
}


//--------------------------------------


async function getStatus(hashmap){
    const arr = new Array(hashmap.size) 
    const intervalPromises = []

    const result_array = []

    for(let i=0; i<hashmap.size; i++){
        let res = await axios.get(`https://api.hackerearth.com/v4/partner/code-evaluation/submissions/${hashmap.get(i)}`, {headers})    
        const intervalPromise = new Promise(resolve =>{
            const interval = setInterval(async ()=>{
                if(res.data.result.run_status.output){
                    arr[i]=(res.data.result.run_status.output);
                    clearInterval(interval);             // ordering matters
                    resolve()
                }
                else{
                    res = await axios.get(`https://api.hackerearth.com/v4/partner/code-evaluation/submissions/${hashmap.get(i)}`, {headers});
                }
            }, 200)
        });
        intervalPromises.push(intervalPromise)
    }   

    await Promise.all(intervalPromises)

    console.log("arr: ", arr)
    let outputs = new Array(arr.length)
    for(let i=0; i<arr.length; i++){
        await axios.get(arr[i])
        .then(res2 =>{
            const output = res2.data
            outputs[i] = output;
        })
    }

    for(let i=0; i<outputs.length; i++){
        const correct_output = fs.readFileSync(`programs/output/output${i}.txt`, 'utf-8')
        if(correct_output == outputs[i]){
            console.log(i, 'AC')
            result_array.push('AC')
        }
        else{
            result_array.push('WA')
            console.log(i, 'WA')
        }
    }

    return result_array;
}


async function submit(source_file, total_tc){
    const promises = []
    let hashmap = new Map()

    for(let i=0; i<total_tc ; i++){
        const data = {
            lang: 'CPP',
            source: source_file,
            input: fs.readFileSync(`programs/input/input${i}.txt`, 'utf-8'),
            time_limit:1
            //callback: `https://4f9f-2409-4042-2d89-22db-2a1e-535f-f2b2-dafa.ngrok-free.app/callback`
        }

        promises.push(axios.post('https://api.hackerearth.com/v4/partner/code-evaluation/submissions/', data, {headers}))
    }

    const responses = await Promise.all(promises)
    for(let i=0; i<responses.length; i++){
        hashmap.set(i, responses[i].data.he_id)
    }
    console.log(hashmap)
    return getStatus(hashmap)
}

 

//POST /challenges/:id/submit
exports.challenge_submit = async function(req, res){

    // fetch the testcases from the db using the :id
    Challenge.findOne({cnt: req.params.id}, async (err, challenge_data)=>{
        if(err){
            console.log(err)
            res.json({
                'message' :'failed'
            })
        }
        else{
            let chal_data = {
                title: challenge_data.title,
                statement: challenge_data.statement,
                constraints: challenge_data.constraints,
                input_format: challenge_data.input_format,
                output_format: challenge_data.output_format
            }

            get_tc_details(challenge_data)
            .then(async tc_data=>{
                // save them in files
                // samples -> tc_data.samples
                let i=0, j=0;

                for(i; i<tc_data.samples.length; i++){
                    fs.writeFileSync(`programs/input/input${i}.txt`, tc_data.samples[i].input);
                    fs.writeFileSync(`programs/output/output${i}.txt`, tc_data.samples[i].output);
                }

                // hiddens-> tc_data.hiddens
                for(j; j<tc_data.hiddens.length; j++){
                    fs.writeFileSync(`programs/input/input${i+j}.txt`, tc_data.hiddens[j].input);
                    fs.writeFileSync(`programs/output/output${i+j}.txt`, tc_data.hiddens[j].output);
                }
                
                // run source code against these testcases
                let result_ar = await submit(req.body.source_code, i+j)         // i+j total test cases needed to be run
                
                // remove the io files
                const inputDir = './programs/input';
                const in_files = fs.readdirSync(inputDir);

                // Remove each file individually
                in_files.forEach(file => {
                    const filePath = path.join(inputDir, file);
                    fs.unlinkSync(filePath);
                });

                const outputDir = './programs/output'
                const op_files = fs.readdirSync(outputDir)

                op_files.forEach(file=>{
                    const filePath = path.join(outputDir, file)
                    fs.unlinkSync(filePath)
                })

                res.send({
                    'message': 'ok',
                    'results': result_ar
                })
            })
            .catch(error=>{
                console.log(error)
                res.send({
                    'message': 'failed'
                })
            })
        }
    })



    // run against those testcases
    // let result_ar = await submit(req.body.source_code)
    // res.send({
    //     message:'ok',
    //     results: result_ar
    // })
}



exports.add_moderator_for_challenge = function(req, res){
    const mod = req.body.moderator  

    Challenge.findOneAndUpdate({cnt: req.params.id},
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


exports.remove_moderator_for_challenge = function(req, res){
    const mod = req.body.moderator  

    Challenge.findOneAndUpdate({cnt: req.params.id},
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





//---------------------------------------




//POST /challenges/:id/upload_tc/sample
exports.upload_tc_sample = function(req, res){

    const input_content = fs.readFileSync(req.files.sample_in_tc[0].path, {encoding: 'utf-8'})
    const output_content = fs.readFileSync(req.files.sample_op_tc[0].path, {encoding: 'utf-8'})

    Counts.findById(process.env.COUNT_ID, (err, doc)=>{
        if(err) console.log(err)
        else{
            console.log(doc)
            doc.test_case_count+=1;
            doc.save()
            .then(response=>{
                const test_case = new TestCase({
                    cnt: doc.test_case_count,
                    input: input_content,
                    output: output_content,
                    explanation: req.body.explanation
                })
                test_case.save()
                .then(result=>{
                    console.log("doc saved to the database tC") 
                    Challenge.findOne({cnt: req.params.id})
                    .then(ch=>{
                        ch.sample_test_cases.push(result._id)
                        ch.save()
                        .then(()=>{
                            console.log('sample test case added to challenge')
                        })
                        .catch(()=>{
                            console.log('sample test case not added to challenge')
                        })
                    })
                    .then(()=>{
                        const uploads_dir = '../server/uploads/';
                        fs.readdirSync(uploads_dir).forEach((file)=>{
                            fs.rmSync(`./${uploads_dir}/${file}`)
                        })
                        
                        res.json({
                            message: 'ok'
                        })
                    })
                })
                .catch(error=>{ 
                    console.log("not saved ... error")
                    res.json({
                        message: 'failed'
                    })
                })
            })
            .catch(err=>{
                console.log('doc.testcase_count not updated', err)
            })
        }
    })
}


exports.upload_tc_hidden = function(req, res){

    const input_content = fs.readFileSync(req.files.hidden_in_tc[0].path, {encoding: 'utf-8'})
    const output_content = fs.readFileSync(req.files.hidden_op_tc[0].path, {encoding: 'utf-8'})

    Counts.findById(process.env.COUNT_ID, (err, doc)=>{
        if(err) console.log(err)
        else{
            console.log(doc)
            doc.test_case_count+=1;
            doc.save()
            .then(response=>{
                const test_case = new TestCase({
                    cnt: doc.test_case_count,
                    input: input_content,
                    output: output_content,
                    explanation: req.body.explanation
                })
                test_case.save()
                .then(result=>{
                    console.log("doc saved to the database tC") 

                    Challenge.findOne({cnt: req.params.id})
                    .then(ch=>{
                        ch.hidden_test_cases.push(result._id)
                        ch.save()
                        .then(()=>{
                            console.log('hidden test case added to challenge')
                        })
                        .catch(()=>{
                            console.log('hidden test case not added to challenge')
                        })
                    })
                    .then(()=>{
                        const uploads_dir = '../server/uploads/';
                        fs.readdirSync(uploads_dir).forEach((file)=>{
                            fs.rmSync(`./${uploads_dir}/${file}`)
                        })
                        
                        res.json({
                            message: 'ok'
                        })
                    })
                })
                .catch(error=>{ 
                    console.log("not saved ... error")
                    res.json({
                        message: 'failed'
                    })
                })
            })
            .catch(err=>{
                console.log('doc.testcase_count not updated', err)
            })
        }
    })
}




exports.delete_tc = function(req, res){
    const ctg = req.body.ctg ;              // sample / hidden
    const index = req.body.key ;              // which tc?(0-based)

    console.log('ttt' , ctg, index)

    Challenge.findOne({cnt: req.params.id}, (er, doc)=>{
        if(er) console.log(er)
        else{
            let ref_id;
            if(ctg==='sample') ref_id = doc.sample_test_cases[index]
            else ref_id = doc.hidden_test_cases[index]

            console.log('ref_id', ref_id)

            TestCase.deleteOne({_id: ref_id})
            .then(async (response)=>{
                // removing from challenge data
                if(ctg==='sample') doc.sample_test_cases.splice(index, 1);
                else doc.hidden_test_cases.splice(index, 1);
                await doc.save()
                
                console.log('tc deleted..')
                res.json({
                    'message':'ok'
                })
            })
        }
    })
}




//GET /challenges/:id/delete
exports.delete_challenge = function(req, res){
    const challenge_id = req.params.id 
    const user = req.body.user
    
    Challenge.findOne({cnt: challenge_id}, async (err, challenge_data)=>{
        if(err){
            console.log(err)
            res.json({
                'message': err
            })
        }
        else{

            console.log('sdfdd', challenge_data)
            // also wiping out the testcases...         
            const sample_len = challenge_data.sample_test_cases.length;
            const hidden_len = challenge_data.hidden_test_cases.length;
            const total_cases = sample_len + hidden_len;

            const newPromise = new Promise((resolve, reject)=>{
                const promises = [];
    
                for(let i=0; i<total_cases; i++){
                    let ref_id;
                    if(i<sample_len) ref_id = challenge_data.sample_test_cases[i];
                    else ref_id = challenge_data.hidden_test_cases[i]   
    
                    const promise = TestCase.remove({_id: ref_id});
                    promises.push(promise);
    
                    promise.then(response=>{
                        console.log('test case removed: ', ref_id)
                    })
                    .catch(er=>{
                        console.log("error in deleting the test case")
                        reject(er)
                    })
                }

                Promise.all(promises)        // wait for all promises to resolve
                .then(async ()=>{
                    const user_doc = await User.findOne({username: user})
                    user_doc.challenges.delete(challenge_id)              // removing from the user doc challenges list 
                    await user_doc.save()

                    // removing from the contest data as well
                    await Contest.updateMany(
                        { challenges_list : {$in: [challenge_id]}},
                        { $pull: { challenges_list: challenge_id}}
                    )
                    
                    await Challenge.deleteOne({cnt: challenge_id});       // now delete the ch itself
        
                    console.log("challenge with id: ", challenge_id, " successfully deleted")
                    res.json({
                        'message': 'ok'
                    })
                    resolve();
                })
                .catch(err=>{
                    console.log("error in removing the test cases: ", err)
                    reject(er);
                })

            })

        }
    })
}

exports.get_tc_details = get_tc_details;