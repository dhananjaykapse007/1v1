import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './ChallengeTestCases.css'

const headers ={
    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
}

export default function ChallengeTestCases({ch_id}){
    const [isSample, setIsSample] = useState(false)
    const [inTc, setInTc] = useState(null)
    const [opTc, setOpTc] = useState(null)

    const [isExp, setIsExp] = useState(false);        // to show the explanation textarea
    const [explanation, setExplanation]= useState('')

    const [totalTc, setTotalTc]  = useState(0);        // total test cases
    const [samples, setSamples] = useState(0);       // total sample cases (for drawing hr line)
    const [tcData, setTcData] = useState([{}])       // array of objects...

    useEffect(()=>{
        axios({
            method: 'get',
            url: `http://localhost:8000/challenges/${ch_id}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(response=>{
            // console.log('sdf', response)
            const tc_data = [...response.data.sample_testcase_details, ...response.data.hidden_testcase_details]            
            setTcData(tc_data);
            setTotalTc(tc_data.length)
            setSamples(response.data.sample_testcase_details.length)
        })
        .catch(er=>{
            console.log(er)
        })
    
    }, [])
    
    
    const handleSubmit = (e)=>{
        e.preventDefault()
        
        if(isSample){
            // upload as sample test case
            const formData = new FormData()
            formData.append('sample_in_tc', inTc)
            formData.append('sample_op_tc', opTc)
            formData.append('explanation', explanation)
        
            console.log(formData)
        
            axios.post(`http://localhost:8000/challenges/${ch_id}/upload_tc/sample`, formData, {headers})
            .then(response=>{
                // console.log(response)
                if(response.data.message==='ok'){
                    alert("Test case successfully uploaded.")
                    setInTc(null)
                    setOpTc(null)
                    const input_file = document.getElementsByName('in_tc')[0]
                    const output_file = document.getElementsByName('op_tc')[0]
                    const explanation = document.getElementsByName('explanation')[0]
                    input_file.value = ''
                    output_file.value = ''
                    explanation.value = ''
                }
                else{
                    alert("Some error occured. Try again.")
                }
            })
            .catch(error=>{
                console.log(error)
            })
        }
        else{
            // upload as hidden test case
            const formData = new FormData()
            formData.append('hidden_in_tc', inTc)
            formData.append('hidden_op_tc', opTc)
        
            console.log(formData)
        
            axios.post(`http://localhost:8000/challenges/${ch_id}/upload_tc/hidden`, formData, {headers})
            .then(response=>{
                // console.log(response)
                if(response.data.message==='ok'){
                    alert("Test case successfully uploaded.")
                    setInTc(null)
                    setOpTc(null)
                    const input_file = document.getElementsByName('in_tc')[0]
                    const output_file = document.getElementsByName('op_tc')[0]
                    input_file.value = ''
                    output_file.value = ''
                }
                else{
                    alert("Some error occured. Try again.")
                }
            })
            .catch(error=>{
                console.log(error)
            })
        }
    }

    const _isSample = (e)=>{
        setIsSample(e.target.checked)
        setIsExp(e.target.checked)
    }

    const showTcData = (index, tag)=>{
        let data;
        // console.log('dd', tcData, index)

        if(tag==='i') data = tcData[index].input;
        else data = tcData[index].output;
        const newWindow = window.open('', '_blank');      
        newWindow.document.write(`<pre>${data}</pre>`)
    }
    
    const removeTc = (index)=>{  
        // remove testcase from the challenge data
        let ctg;     // category (sample / hidden)

        if(index < samples) ctg= 'sample'
        else{
            ctg='hidden';
            index -= samples;      // getting the 0based index for hidden testcases
        }

        axios({
            method: 'post',
            url:`http://localhost:8000/challenges/${ch_id}/delete_tc`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            data:{
                ctg: ctg,
                key: index
            }            
        })
        .then(response=>{
            console.log(response)
            if(response.data.message==='ok'){
                alert('ok')
                // also remove from the list
                // setTotalTc(totalTc-1)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }


    return(
        <div className='tc-div'>
            <h2 className='tc-header'>Test Cases</h2>
            <p className='tc-i-note'><i>Add test cases to judge the correctness of a users code.</i></p>
            

            <form onSubmit={handleSubmit} enctype="multipart/form-data">
                <table>
                    <tr className='tc-table-row'>
                        <label className='tc-label' for='in_tc'> Input:  </label> 
                        <input className='tc-io-file-button1' type="file" name='in_tc' onChange={(e)=>setInTc(e.target.files[0])} /><br />
                    </tr>

                    <tr>
                        <label className='tc-label' for='op_tc'> Output:  </label> 
                        <input className='tc-io-file-button2' type="file" name='op_tc' onChange={(e)=>setOpTc(e.target.files[0])} /> <br />
                    </tr>
                    
                    <tr>
                        <label className='tc-label' for='is_sample_tc'> Mark as sample? </label>
                        <input className='sample-checkbox' type='checkbox' name='is_sample' onChange={_isSample}></input>
                    </tr>
                </table>


                { isExp ? (
                    <>
                        <label className='tc-label' for='explanation'>Explanation: </label>
                        <textarea className='tc-exp-textarea' type='text' name='explanation' onChange={(e)=>setExplanation(e.target.value)} > </textarea>
                    </>
                )
                :
                null 
                }

                
                <button className='tc-upload-button' type='submit'> Upload </button>
            </form>


            <h4 className='added-tc-header'> Added testcases for this challenge: </h4>
            <table>

            {
                Array(totalTc).fill().map((_, index)=>{
                    return (
                        <div>
                            <tr>
                                <td><a className='added-tc-data' onClick={()=> showTcData(index, 'i')} href='#'> {index< samples ? 's_' : 'h_'}input{index+1} </a></td>
                                <td><a onClick={()=> showTcData(index, 'o')} href='#'> {index< samples ? 's_' : 'h_'}output{index+1} </a></td>
                                <button className='tc-rem-button' onClick={()=> removeTc(index) }>Remove</button>
                            </tr>
                        </div>
                    )
                })
            }

            </table>
        </div>
    )
}