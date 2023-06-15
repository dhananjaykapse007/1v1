import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

export default function Challenges(){
    // const navigate = useNavigate()
    // const [challengesList, setChallengesList] = useState(new Map())

    // useEffect(()=>{
    //     axios({
    //         method: 'post',
    //         url:"http://localhost:8000/challenges/user-challenges",
    //         headers:{
    //             'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    //         },
    //         data:{
    //             owner: localStorage.getItem('username')
    //         }
    //     })
    //     .then(result=>{
    //         console.log(typeof result.data.data.challenges);          
    //         setChallengesList(result.data.data.challenges)
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
    // }, [])

    // const createChallenge = ()=>{
    //     axios({
    //         method:'post',
    //         url:'http://localhost:8000/challenges/create',
    //         headers:{
    //             'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    //         },
    //         data:{
    //             owner: localStorage.getItem('username')
    //         }
    //     })
    //     .then(res=>{
    //         console.log(res.data)
    //         const cnt = res.data.cnt;
    //         navigate(`/challenges/${cnt}/edit`)
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     })
    // }

    // return(
    //     <div>
    //         <h2> Create your own Challenges </h2>
    //         <button onClick={createChallenge}> Create Challenge </button>
    //         <h3> Your Challenges </h3>
            
    //         {
    //             Object.keys(challengesList).map(key=>(
    //                 <div key={key}>
    //                     <a href={`/challenges-page/${key}`}>{key} {challengesList[key]} </a>
    //                     <button><a href={`challenges/${key}/edit`}> Edit </a></button> 
    //                 </div>
    //             ))
    //         }


    //     </div>
    // )
}