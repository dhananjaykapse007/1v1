import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function ChallengesPage(){
    const [challenges, setChallenges] = useState([])      // consists of only 'cnt's

    useEffect(()=>{
        axios({
            method:'post',
            url: 'http://localhost:8000/challenges',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            data:{
                owner: localStorage.getItem('username')
            }
        })
        .then(response=>{
            console.log(response.data.data.challenges)
            setChallenges(response.data.data.challenges)
        })
        .catch(error=>{
            console.log(error)
        })
    }, [])


    return (
        <div>
            <h2> All Challenges </h2>
            {
                Object.keys(challenges).map(key=>(
                    <div key={key}>
                        <a href={`/challenges-page/${key}`}>{challenges[key]} </a> 
                    </div>
                ))
            }
        </div>
    )
}