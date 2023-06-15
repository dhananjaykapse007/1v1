import React, {useState} from 'react'

export default function EditChallenge(){
    // const [numInputs, setNumInputs] = useState(0)

    // const AddInput=()=>{
    //     setNumInputs(numInputs+1)
    // }

    // const inputs = []
    // for(let i=0; i<numInputs; i++){
    //     inputs.push(
    //         <div>
    //             <label for='files'>Add test case {i+1}</label>
    //             <input type='file' id='files' name='files'>Choose input file</input>
    //             <input type='file' id='files' name='files'>Choose output file</input>
    //             <button type='submit'>Upload</button>
    //         </div>
    //     )
    // }

    const inputStyle={
        height: '100px',
        width: '400px'
    }

    return(
        <div className='challenge'>
            <h2> Create a Challenge </h2>
            <form action='http://localhost:8000/challenges/add' method='post'>
                <label for='title'> Problem Title:  </label> 
                <input type='text' name="problem_title" /> <br />
                <label for='statement'> Problem Statement:  </label> 
                <input type='text' name="problem_statement" style={inputStyle} /> <br />
                <label for='constraints'> Constraints:  </label> 
                <input type='text' name="constraints" style={inputStyle} /> <br />
                <label for='input_format'> Input Format:  </label> 
                <input type='text' name="input_format" style={inputStyle} /> <br />
                <label for='output_format'> Output Format:  </label> 
                <input type='text' name="output_format" style={inputStyle} /> <br />
            </form>

            <h4> Add sample test cases</h4>
            <form action='/add-sample-test-case' method='post' encType='multipart/form-data'>
                <input type='file' id='files' name='files' />
                <input type='file' id='files' name='files' />
                <button type='submit'>Upload</button>   
            </form> 
        </div>
    )
}