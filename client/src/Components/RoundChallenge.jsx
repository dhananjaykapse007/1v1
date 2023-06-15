import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {socket} from '../socket'
import axios from 'axios'
import Challenge from './ChallengePage'
import Countdown from './CountdownTimer'
import './RoundChallenge.css'



export default function RoundChallenge(){
    // form a ws connection betn client and server
    // render the challenge page
    const {cnt, round, ch_id} = useParams()
    const [startTime, setStartTime] = useState()
    const [showChallenge, setShowChallenge] = useState(false)


    useEffect(()=>{
        socket.connect()

        socket.emit('client-data', {
            username: localStorage.getItem('username')
        })

        socket.on('get-result', (data)=>{
            alert(data)
        })

        socket.on('announcement', (announcement)=>{
            alert(`Announcement: ${announcement}`)
        })

        return ()=>{
            socket.disconnect()
        }
    }, [])


    useEffect(()=>{
        // get the time from the contest data
        axios({
            method:'get',
            url:`http://localhost:8000/contest/${cnt}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(details=>{
            let temp = new Date(details.data.body.start_time)
            temp = new Date(temp.getTime() + (30*60*1000*(round-1)))           // adding ms amount of time
            temp = temp.toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})
            setStartTime(temp)

            let start = new Date(details.data.body.start_time);
            start= new Date(start.getTime() + (30*60*1000*(round-1)))
            const end = new Date(start.getTime() + 20*60*1000)
            const cur_t = new Date()

            // console.log(start, end)

            if(cur_t >= end) setShowChallenge(false)
            else setShowChallenge(true)
        })
        .catch(e=>{
            console.log(e)
        })
    }, [])


    const hideChallenge = ()=>{
        setShowChallenge(false)
    }


    return(
        <div className='round-ch-div'>
            {/* <h4> Round {round} </h4>
            <p> Started At: {startTime} </p> */}
            <Countdown startTime={startTime} cnt={cnt} cb={hideChallenge} />

            {showChallenge ? <Challenge /> : <p style={{ marginLeft: '900px', marginTop: '350px', fontFamily:'Calibri', fontSize: '20px'}}><i>Round is over.</i></p> }
        </div>
    )
}