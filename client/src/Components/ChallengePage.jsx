import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import FreeMode from './FreeMode'
import './ChallengePage.css'


export default function ChallengePage(){
    const {ch_id} = useParams()             // ch_id is for the challenge

    const [challenge, setChallenge] = useState({
        title: '',
        statement: '',
        constraints: '',
        input_format: '',
        output_format: ''
    })
    const [tc, setTc] = useState([]);

    useEffect(()=>{
        axios({
            method: 'get',
            url: `http://localhost:8000/challenges/${ch_id}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(details=>{
            setChallenge(details.data.challenge_details)
            setTc(details.data.sample_testcase_details)
            // console.log('tcs: ', details.data.sample_testcase_details)
        })
        .catch(error=>{
            console.log(error)
        })
    }, []);

    return(
        <div className='ch-container'>

            <div className='problem-panel'>
                <h3 className='ch-title'>{challenge.title}</h3>
                <hr />
                <p className='ch-page-statement'>{challenge.statement}</p>
                
                <h4 className='ch-page-header'> Input Format: </h4>
                <p className='ch-page-details'> {challenge.input_format}</p>
                
                <h4 className='ch-page-header'> Output Format: </h4>
                <p className='ch-page-details'> {challenge.output_format}</p>

                <h4 className='ch-page-header'> Constraints: </h4>
                <p className='ch-page-details'> {challenge.constraints}</p>

                <hr />

                <h4 className='ch-page-header'> Sample Cases </h4>

                {tc.map((testcase, index)=>{
                    return (
                        <div key={index}>
                            <h4 style={{fontSize: '17px', fontFamily: 'Calibri', paddingBottom: '5px'}}>Example {index+1}</h4>
                            <p className='ch-page-details'><b>Input: </b> {testcase.input}</p>
                            <p className='ch-page-details'><b>Output: </b> {testcase.output}</p>
                            { testcase.explanation!=='' ? <p className='ch-page-details'><b>Explanation: </b> {testcase.explanation}</p> : null } 
                        </div>
                    )
                })}            
                <hr />
            </div>

            <div className='vertical-line'> </div>

            <div className='code-editor-panel'>
                <div>
                    <h4 className='code-ed-header'>Code Editor
                    <hr /></h4>
                </div>
                <div className='editor'>
                    <FreeMode tag1={''} tag2={''} tag3={'submit'} challenge_cnt={ch_id} freemode={false} />
                </div>

                {/* <div className='buttons-div'>
                    <button id='run-button'> Run </button>
                    <button id='submit-button'> Submit </button> 
                </div> */}
            </div>

        </div>
    )
}