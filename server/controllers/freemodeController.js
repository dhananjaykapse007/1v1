// no usage of testcases
const fs = require('fs')
const axios = require('axios')

const headers = {
    'Content-Type': 'application/json',
    'client-secret': process.env.CODE_CLIENT_SECRET
};


//POST /freemode/submit
exports.submit_code = async function(req, res){
    const source_file = req.body.source_code
    // console.log(source_file)
    console.log('submission request revceived')
    
    let response_body = {
        message: '',
        data: ''
    };
    
    const data = {
        lang: 'CPP', 
        source: req.body.source_code,
        input: req.body.input,
        time_limit: 1
    }


    let results;    
    const intervals = []
    let end=false
    
    await axios.post(process.env.CODE_SUBMISSION, data, {headers})
    .then(async result=>{
        // 
        const he_id = result.data.he_id
        let eval_res = await axios.get(`${process.env.CODE_SUBMISSION}/${he_id}`, {headers})
        const intervalPromise = await new Promise((resolve, reject)=>{
            const interval = setInterval(async ()=>{
                // console.log('eval_res.data: ', eval_res.data)
                if(eval_res.data.result.run_status.output){
                    results = eval_res.data.result.run_status.output;
                    clearInterval(interval)
                    resolve()
                }
                else{
                    if(eval_res.data.request_status.code === 'CODE_COMPILED'){
                        if(eval_res.data.result.compile_status !== 'OK'){
                            results = eval_res.data.result.compile_status
                            end=true;
                            clearInterval(interval)
                            reject()
                        }
                    }
                    eval_res = await axios.get(`${process.env.CODE_SUBMISSION}/${he_id}`, {headers})
                }
            }, 200);
        })
        intervals.push(intervalPromise)
    })
    .catch(error=>{
        response_body.message = error
    })

    await Promise.all(intervals)
    console.log('ress:',results)
    
    if(end){
        response_body.message = 'failed'
        response_body.data =results             // some error message
        res.json(response_body)
    }
    else{
        await axios({
            method: 'get', 
            url: results,
            responseType: 'stream'
        })
        .then(async response=>{
            await new Promise((resolve, reject)=>{
                const writeStream = fs.createWriteStream('../server/programs/output/output.txt');
                response.data.pipe(writeStream)
                writeStream.on('finish', ()=>{
                    console.log('successs...')
                    resolve()
                })
                writeStream.on('error', (err)=>{
                    console.log('failure...')
                    reject(err)
                });
            })
    
            let result_output =  fs.readFileSync('../server/programs/output/output.txt')
            console.log('output sent')
            response_body.message= 'ok',
            response_body.data= Buffer.from(result_output).toString()
        })
        .catch(error=>{
            response_body.message='failed'
            response_body.data = 'internal server error'
        })

        res.json(response_body)
    }

}

