import React, {useState, useEffect} from 'react'
import {socket} from '../socket'
import axios from 'axios'

export default function Status({results_ar, cnt, round, submissionTime}){
    const [status, setStatus] = useState(false)

    useEffect(()=>{
        let correct_tc =0;
        results_ar.map((res, ind)=>{
            if(res==='AC') correct_tc++;
        })
    
        if(correct_tc==results_ar.length){
            setStatus(true)
    
            // convey the opponent about the results
            axios({
                method:'post',
                url:`http://localhost:8000/contest/${cnt}/round/${round}/submit-ac`,
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                data:{
                    username: localStorage.getItem('username'),
                    submissionTime: submissionTime              // submission time when the submit button was clicked
                }
            }) 
            .then(response=>{
                // console.log('ressdfdfe', response)
                // if(response.data.message==='ok'){
                //     if(response.data.won) alert('You won the round!!')
                //     else alert("Your opponent has already won the round.")
                // }
                // else{
                //     alert('Error in submission. Try again!')
                // }
            })
            .catch(e=>{
                console.log(e)
            })
        }
    }, [])


    return(
        <div>
            <h4> Status: {status ? "ACCEPTED" : "REJECTED"} </h4>
            {
                results_ar.map((tc_result, index)=>{
                    return(
                        <div key={index}>
                            <p> TestCase {index+1}: {tc_result} </p>
                        </div>
                    )
                })
            }
        </div>
    )
}