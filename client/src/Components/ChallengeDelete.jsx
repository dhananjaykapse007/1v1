import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ChallengeDelete.css'


export default function ChallengeDelete({ch_id}){
    const nav = useNavigate()

    const deleteChallenge =()=>{
        if(window.confirm('Are you sure?')){
            axios({
                method:'post',
                url:`http://localhost:8000/challenges/${ch_id}/delete`,
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                data:{
                    user: localStorage.getItem('username')
                }
            })
            .then(response=>{
                if(response.data.message==='ok'){
                    nav('/administration')
                }
            })
            .catch(error=>{
                alert('try again...')
            })
        }
    }

    return(
        <div className='ch-del-div'>
            <button className='ch-del-button' onClick={deleteChallenge}>Delete Challenge</button>
            <p className='ch-del-note'><i>Deleting the challenge will wipeout entire data about the challenge.</i></p>
        </div>
    )
}