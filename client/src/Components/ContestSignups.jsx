import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './ContestSignups.css'

export default function ContestDetails({cnt}){
    
    const [signups, setSignups] = useState([])


    useEffect(()=>{
        axios({
            method:'get',
            url:`http://localhost:8000/contest/${cnt}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(response=>{
            // console.log(`contest ${cnt} details: `, response.data)
            setSignups(response.data.body.participants)
        })
        .catch(err=>{
            console.log(err)
        })
    },[])



    return(
        <div className='contest-signups-div'>
            <h3 className='signups-header'> Signups</h3>
            {/* { loading ? <p '>Loading...</p>} */}
            {
                signups.map((participant, index)=>{
                    return <p className='participant-p'>{index+1}. {participant} </p>
                })
            }
        </div>
    )
}


