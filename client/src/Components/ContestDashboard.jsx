import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
// import {socket} from '../socket'
import axios from 'axios'
import './ContestDashboard.css'
import RoundSchedule from './RoundSchedule'
import Results from './Results'
import Standings from './Standings'
import Announcements from './Announcements'
import Schedule from './RoundSchedule'


export default function Dashboard(){
    const {cnt} = useParams()
    const nav = useNavigate()
    
    const [activeTab, setActiveTab] = useState('schedule')        // default is the schedule
    const [participants, setParticipants] = useState([])
    const [contestTitle, setContestTitle] = useState('Contest')
    const [curRound, setCurRound] = useState(0)
    const [startTime, setStartTime] = useState('')
    const [enterRound, setEnterRound] = useState(true)
    const [roundDuration, setRoundDuration] = useState(0)
    const [announcements, setAnnouncements] = useState([])      // array of strings
    const [standings, setStandings] = useState([])        // string array of participants
    const [roundResults, setRoundResults] = useState([
        {
            round: 0,
            start_time: null,
            duration: null,
            table: new Map(),
            standings: new Array()
        }
    ])                       
    const [player2, setPlayer2] = useState('TBD')
    const [challenge_list, setChallenge] = useState(-1)          // challenges list for the contest and then choose the particular challenge
    
    const player1 = localStorage.getItem('username')
    

    const calculateRoundStartTime= (ist_date)=>{
        axios({
            method:'get',
            url:`http://localhost:8000/contest/${cnt}/get-next-round`,        // from swiss
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(res=>{
            setCurRound(res.data.next_round)
            const cur_round = res.data.next_round

            let start_t = new Date(ist_date)
            start_t = new Date(start_t.getTime()+30*60*1000*(cur_round-1))
            start_t = start_t.toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})

            setStartTime(start_t)

            // console.log('next_round', res.data.next_round)
        })
        .catch(e=>{
            console.log(e)
        })
    }
    

    useEffect(()=>{
        // fetch details for this contest
        axios({
            method: 'get',
            url: `http://localhost:8000/contest/${cnt}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(details=>{
            // console.log(new Date(details.data.body.start_time))
            // setParticipants(details.data.body.participants)
            setContestTitle(details.data.body.title)
            setRoundDuration(details.data.body.round_duration)
            setAnnouncements(details.data.body.announcements)
            setChallenge(details.data.body.challenges_list)

            const start_utc_date = new Date(details.data.body.start_time)
            const start_ist_date = start_utc_date.toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})
            setStartTime(start_ist_date)

            calculateRoundStartTime(start_ist_date)

        })
        .catch(error=>{
            console.log(error)
        })

    }, [])




    // useEffect(()=>{
    //     let start_t = new Date(startTime)   
    //     start_t = new Date(start_t.getTime() + (30*60*1000*(curRound-1)))
    //     start_t = start_t.toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})
    //     setStartTime(start_t)        
        
    // }, [curRound])


    // make the enterRound true only when the curRound and challenge_list is available (and only when that round starts)
    
    
    useEffect(()=>{
        // to fetch the opponent/results (for curRound) 1 min prior to round
        let start_t = new Date(startTime).getTime();         // time of the round and not the contest
        start_t = new Date(start_t - 1*60*1000)         // 1 min before the round, fetch the pairings (using results table)
        let dif_t = new Date(start_t) - new Date()        // remaining time for the start of the round
        dif_t = Math.max(0, dif_t)

        if(dif_t >=0){
            setTimeout(()=>{
                axios({
                    method:'get',
                    url:`http://localhost:8000/contest/${cnt}/results`,
                    headers:{
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                    }
                })
                .then(res=>{
                    // console.log('results: ', res.data.results)
                    const len = res.data.results.length       // total rounds (last round may be incomplete)
                    setRoundResults(res.data.results)

                    if(res.data.results[len-1].isDone===false && len>=2) setStandings(res.data.results[len-2].standings) ;         // last round which is completed
                    else if(res.data.results[len-1].isDone===true) setStandings(res.data.results[len-1].standings)
                })
                .catch(er=>{
                    console.log(er)
                })
            }, dif_t)
        }

    }, [startTime])



    
    
    const _enterRound= ()=>{
        const challenge = challenge_list[curRound-1]
        nav(`/contest/${cnt}/round/${curRound}/challenge/${challenge}`)
    }
    
    
    return(
        <div className='dash-view'>
            <h3 style={{fontFamily:'Helvetica', fontSize:'23px', marginBottom: '-10px'}}> {contestTitle} </h3>
            <p style={{fontFamily:'Calibri'}}>Dashboard</p>
            <hr />
            
            <div className='dash-container'>
                <div className='dash-row'>
                    <div className='card'>
                        <Schedule round={curRound} startTime={startTime} roundDuration={roundDuration} enterRound={enterRound} cnt={cnt} curRound={curRound} challenge={challenge_list[curRound-1]}/>
                    </div>

                    <div className='card'>
                        <Results roundResults={roundResults}/>
                    </div>
                </div>

                <div className='dash-row'>                   
                    <div className='card'>
                        <Announcements announcements={announcements}/>
                    </div>
       
                    <div className='card'>
                        <Standings last_round={curRound-1} roundResults={roundResults}/>
                    </div>
                </div>

            </div>

        </div>
    )
}





    // api call to remove the participant from the list
    // const removeParticipant=(user)=>{
    //     axios({
    //         method:'post',
    //         url:`http://localhost:8000/contest/${cnt}/remove-participant/`,
    //         headers:{
    //             'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    //         },
    //         data:{
    //             participant: user 
    //         }
    //     })
    //     .then(response=>{
    //         if(response.data.body.message==='ok'){
    //             const ind = participants.indexOf(user)
    //             if(ind> -1){
    //                 // participant found
    //                 participants.splice(ind, 1);        // remove that user from the list
    //             }
    //         }
    //     })
    // }