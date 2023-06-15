import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './RoundSchedule.css'

export default function Schedule({round, startTime, roundDuration, enterRound, cnt, curRound, challenge }){
    const nav = useNavigate()

    const _enterRound = ()=>{
        nav(`/contest/${cnt}/round/${curRound}/challenge/${challenge}`)
    }

    return (
        <div className='schedule'> 
            <div className='sch-box'>
                <h3 className='card-header'> Schedule </h3>
                <hr style={{margin: '10px 20px 10px 20px'}}/>

                <table className='sch-table'>
                    <tr>
                        <td className='sch-round-details'>Round:</td>
                        <td className='sch-round-details'>{round}</td>
                    </tr>
                    <tr>
                        <td className='sch-round-details'>Time:</td>
                        <td className='sch-round-details'>{startTime}</td>
                    </tr>
                    <tr>
                        <td className='sch-round-details'>Duration:</td>
                        <td className='sch-round-details'>{roundDuration} min</td>
                    </tr>
                </table>
                { enterRound ? <button className='sch-round-enter-button' onClick={()=> _enterRound() } > Enter </button> : null }
            </div>
        </div>
    )
}