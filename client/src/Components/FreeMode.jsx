import React, {useState} from 'react'
import {useParams} from 'react-router-dom'
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import Submit from './Submit'
import './FreeMode.css'


export default function FreeMode({tag1, tag2, tag3, challenge_cnt, freemode}){
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')    
    const [code, setCode] = useState('// Your code goes here');

    return (
        <div>
            { tag1!=='' ? <h2 id='tag1'>{tag1}</h2> : null }
            { tag2!=='' ? <p id='tag2'>{tag2}</p> : null }

            <br />
            <div id='code-editor'>
                <Editor                         // code editor
                    height="660px" 
                    width="100vh"
                    defaultLanguage="cpp"
                    value={code}
                    onChange={(value)=> setCode(value)}
                />
            </div>

            <div className='buttons-div'>
                <button id='run-button'> Run </button>
                <button id='submit-button'> Submit </button> 
            </div>

            <div>
                <h4 className='editor-panel-header'> Input </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>       
             
                <div style={{ flex: '1', marginRight: '10px' }}>
                    <Editor                                      // input editor
                    height="100px"
                    width="100vh"
                    language="plain"
                    theme="vs-dark"
                    value={input}
                    onChange={(value) => setInput(value)}
                    />
                </div>
                </div>
            </div>

            <Submit source_code={code} input={input} tag3={tag3} challenge_cnt={challenge_cnt} freemode={freemode}/>

        </div>
    )
}   

FreeMode.defaultProps = {
    tag1: "Sandbox Environment",
    tag2: "Run and test your code.",
    tag3: ""
}
