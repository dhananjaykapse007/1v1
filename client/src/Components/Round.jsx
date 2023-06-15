import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Countdown from './CountdownTimer'
import io from 'socket.io-client'

export default function Round(){
    // form a ws connection betn client and server
    // render the challenge page 
    const { cnt, round } = useParams()

    useEffect(()=>{

    }, [])


    return (
        <div>
            <h3> Round {round} </h3>
            <p> {localStorage.getItem('username')} <b>v/s</b> player2 </p>
            <h4> Timer: </h4>
        </div>
    )
}