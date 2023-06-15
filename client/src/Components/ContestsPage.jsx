import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function ChallengesPage(){
    const [contestsList, setContestsList] = useState(new Map())      // consists of only 'cnt's

    useEffect(()=>{
        axios({
            method:'post',
            url: 'http://localhost:8000/contest',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            data:{
                owner: localStorage.getItem('username')
            }
        })
        .then(response=>{
            console.log(response.data.data.contests)
            setContestsList(response.data.data.contests)
        })
        .catch(error=>{
            console.log(error)
        })
    }, [])
    

    return (
        <div>
            <h2> All Contests </h2>
            {
                Object.keys(contestsList).map(key=>(
                    <div key={key}>
                        <a href={`/contests-page/${key}`}>{contestsList[key]} </a> 
                    </div>
                ))
            }
        </div>
    )
}