import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'

export default function EnterContest(){
    const {cnt} = useParams()
    const [contestChallenges, setContestChallenges] = useState([])      
    const [contestTitle, setContestTitle] = useState('Contest')
    const [rounds, setRounds] = useState(null)
    const [round, setRound] = useState(0)

    const nav = useNavigate()


    useEffect(()=>{
        // fetch contest title
        axios({
            method:'get',
            url:`http://localhost:8000/contest/${cnt}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response=>{
            setContestTitle(response.data.body.title)
            setRounds(response.data.body.rounds)
            setRound(response.data.body.next_round);
        })

        // fetch challenges from the contest data
        axios({
            method: 'post',
            url: `http://localhost:8000/challenges/contest-challenges`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data:{
                contest_id: cnt,
            }
        })
        .then(response=>{    
            setContestChallenges(response.data.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }, [])


    const enter_round = ()=>{       // take to the page pl1 vs pl2 scene
            
        axios({
            method: 'post',
            url: `http://localhost:8000/contest/${cnt}/round/${round}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data:{
                round: round,
                user: localStorage.getItem('username')
            }
        })
        .then(response=>{
            console.log(response)
        })
        .catch(er=>{
            console.log(er)
        })
        
        // take to the round page
        nav(`round/${round}`)


    }

    return(
        <div>
            <h2>{contestTitle}</h2>
            <hr />
            {
                Array.from({length: rounds}).map((_, index)=>{
                    return (
                        <div>
                            <h4> Round {index+1} </h4>
                            <p> Starts At: {} </p>
                            <p> Ends At: {} </p>
                            { round===(index+1) ? <button onClick={enter_round}>Enter</button> : null }   
                            <hr />
                        </div>
                    )
                })
            }
            {/* {
                Object.values(contestChallenges).map(ele=>{
                    return (
                        <div key={ele.cnt}>
                            <a href={`/challenges-page/${ele.cnt}`}>{ele.title} </a>
                        </div>
                    )
                })
            } */}
        </div>
    )
}