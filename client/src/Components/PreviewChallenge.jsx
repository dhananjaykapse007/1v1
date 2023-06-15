import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import './PreviewChallenge.css'


export default function ChallengePage(){
    const {ch_id} = useParams()             // ch_id is for the challenge

    const [challenge, setChallenge] = useState({
        title: '',
        statement: '',
        constraints: '',
        input_format: '',
        output_format: ''
    })
    // const [tc, setTc] = useState([]);

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
        })
        .catch(error=>{
            console.log(error)
        })
    }, []);


    return(
        <div>
            <h3 id='preview-ch-title'>{challenge.title}</h3>
            <hr />
            <p className='preview-ch-details'>{challenge.statement}</p>
            
            <h4 className='preview-ch-headers'> Input Format: </h4>
            <p className='preview-ch-details'> {challenge.input_format}</p>
            
            <h4 className='preview-ch-headers'> Output Format: </h4>
            <p className='preview-ch-details'> {challenge.output_format}</p>

            <h4 className='preview-ch-headers'> Constraints: </h4>
            <p className='preview-ch-details'> {challenge.constraints}</p>
        </div>
    )
}