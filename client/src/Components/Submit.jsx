import React, { useState } from "react";
import {useParams} from 'react-router-dom'
import Editor from '@monaco-editor/react';
import SubmitStatus from './SubmitStatus'

import axios from "axios";

function SubmitButton({source_code, input, tag3, challenge_cnt, freemode}) {
  const obj = useParams()      // for taking the cnt, round, ch_id from url

  const [output, setOutput] = useState('')
  const [submit, setSubmit] = useState( tag3==='submit' ? 1: 0)
  const [showStatus, setShowStatus] = useState(false)
  const [tc_results, setTcResults] = useState([])
  const [submissionTime, setSubmissionTime] = useState(new Object())

  const handleRun = async () => { 
    setOutput('Result Pending...')
    axios({
      method:'post',
      url: 'http://localhost:8000/freemode/submit', 
      data: {
        'source_code': source_code,
        'input': input,
        'hidden': 0
      }
    })
    .then(res=>{
      console.log(res.data.data)
      setOutput(res.data.data)
    })
    .catch(err=>{
      setOutput('')
      alert('Some error occured. Try again.')
    })
  }


  const handleSubmit=async()=>{
    setShowStatus(false)
    setSubmissionTime(new Date())      // set the submission time (make an api call )

    axios({
      method:'post',
      url: `http://localhost:8000/challenges/${challenge_cnt}/submit`, 
      headers:{
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      data: {
        'source_code': source_code
      }
    })
    .then(res=>{
      // console.log(res.data.results)
      setTcResults(res.data.results)
      setShowStatus(true)
      // setOutput()

    })
    .catch(err=>{
      alert('Some error occured. Try again.')
    })
  }



  return (
    <div> 
      <h4 className="editor-panel-header"> Output </h4>    
      <div style={{ flex: '1' }}>               
          <Editor
          height="100px"
          width="100vh"
          language="plaintext"
          theme="vs-dark"
          value={output}
          options={{ readOnly: true }}
          />
      </div>
      <br />

      {/* { freemode ? (
        <div>
          <button onClick={handleRun}>Run Code</button>
          { submit ? <button onClick={handleSubmit} >Submit</button>: null}
        </div>
      )
      :
      <div className='buttons-div'>
            <button id='run-button'> Run </button>
            <button id='submit-button'> Submit </button> 
      </div>} */}
      

      {/* Display results for the test cases */}
      { showStatus ? <SubmitStatus results_ar={tc_results} cnt={obj.cnt} round={obj.round} submissionTime={submissionTime} /> : null}
    </div>
  );
}

export default SubmitButton;