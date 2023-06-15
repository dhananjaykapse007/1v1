import React, { useState } from "react";
import {useParams} from 'react-router-dom'
import Editor from '@monaco-editor/react'
import './Submit2.css'

import axios from "axios";

function SubmitButton2({output}) {
  const obj = useParams()      // for taking the cnt, round, ch_id from url

  // const [output, setOutput] = useState('')
  // const [submit, setSubmit] = useState( tag3==='submit' ? 1: 0)
  // const [showStatus, setShowStatus] = useState(false)
  // const [tc_results, setTcResults] = useState([])
  // const [submissionTime, setSubmissionTime] = useState(new Object())

  // const handleRun = async () => { 
  //   setOutput('Result Pending...')
  //   axios({
  //     method:'post',
  //     url: 'http://localhost:8000/freemode/submit', 
  //     data: {
  //       'source_code': source_code,
  //       'input': input,
  //       'hidden': 0
  //     }
  //   })
  //   .then(res=>{
  //     console.log(res.data.data)
  //     setOutput(res.data.data)
  //   })
  //   .catch(err=>{
  //     setOutput('')
  //     alert('Some error occured. Try again.')
  //   })
  // }


  return (
    <div className="2output-panel"> 
      <h4 className="2editor-panel-header"> Output </h4>    
      <div style={{ flex: '1' }}>               
          <Editor
          height="497px"
          width="900px"
          language="plaintext"
          theme="vs-dark"
          value={output}
          options={{ readOnly: true }}
          />
      </div>
      <br />

      {/* Display results for the test cases */}
      {/* { showStatus ? <SubmitStatus results_ar={tc_results} cnt={obj.cnt} round={obj.round} submissionTime={submissionTime} /> : null} */}
    </div>
  );
}

export default SubmitButton2;