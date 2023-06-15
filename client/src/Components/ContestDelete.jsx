import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ContestDelete.css'


export default function ContestDelete({ cnt }){
    const nav = useNavigate()

    const deleteContest =()=>{
        if(window.confirm('Are you sure?')){
            axios({
                method:'post',
                url:`http://localhost:8000/contest/${cnt}/delete`,
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
                alert("unsuccessful.. try again..")
            })
        }
    }

    return(
        <div className='contest-del-div'>
            <button className='contest-del-button' onClick={deleteContest} >Delete Contest</button>
            <p className='contest-del-note'><i>Deleting the contest will wipeout entire data about the contest.</i></p>
        </div>
    )
}