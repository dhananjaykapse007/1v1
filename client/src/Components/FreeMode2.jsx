import React, {useState} from 'react'
import {useParams} from 'react-router-dom'
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import axios from 'axios'
import Submit2 from './Submit2'
import './FreeMode2.css'


export default function FreeMode({tag1, tag2, tag3, challenge_cnt, freemode}){
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')    
    const [code, setCode] = useState('// Your code goes here');

    const handleRun = async () => { 
        setOutput('Result Pending...')
        axios({
          method:'post',
          url: 'http://localhost:8000/freemode/submit', 
          data: {
            'source_code': code,
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

    return (
        <div className='freemode2-div'>
            <h2 id='sandbox-header'>Sandbox Environment</h2>
            <p id='run-test-code-tag'>Run and test your code</p>

            <div className='freemode2-container'>
                <div id='code-editor2'>
                    <h3 style={{fontFamily: "Calibri", fontSize:'16px'}}> Code Editor </h3>
                    <Editor                         // code editor
                        height="660px" 
                        width="100vh"
                        defaultLanguage="cpp"
                        value={code}
                        onChange={(value)=> setCode(value)}
                    />
                    <button id='run-button-freemode2' onClick={()=> handleRun()}> Run </button>
                </div>

                <div className='io'>
                    <h4 className='2editor-panel-header'> Input </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>       
                
                    <div style={{ flex: '1', marginRight: '10px' }}>
                        <Editor                                      // input editor
                        height="100px"
                        width="900px"
                        language="plain"
                        theme="vs-dark"
                        value={input}
                        onChange={(value) => setInput(value)}
                        />
                    </div>
                    </div>
                    <Submit2 output={output} />
                </div>


            </div>

        </div>
    )
}   

FreeMode.defaultProps = {
    tag1: "Sandbox Environment",
    tag2: "Run and test your code.",
    tag3: ""
}
