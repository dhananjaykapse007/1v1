import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ManageContests.css'


export default function ManageContests(){
    const nav = useNavigate()
    const [contestsList, setContestsList] = useState(new Map())
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        axios({
            method: 'post',
            url:"http://localhost:8000/contest",
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            data:{
                owner: localStorage.getItem('username')
            }
        })
        .then(result=>{
            console.log(result.data.data);          // result is the array of the past contests
            setContestsList(result.data.data.contests)
            setLoading(false)
        })
        .catch(err=>{
            console.log(err)
        })
    }, [])

    const createContest = ()=>{
        axios({
            method:'post',
            url:'http://localhost:8000/contest/create',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            data:{
                owner: localStorage.getItem('username')
            }
        })
        .then(res=>{
            console.log(res.data)
            const cnt = res.data.cnt
            nav(`/contest/${cnt}/edit`)
        })
        .catch(err=>{
            console.log(err)
        })
    }


    const to_edit = (key)=>{
        nav(`/contest/${key}/edit`)
    }



    return (
        <div>
            <button id='create-contest-button' onClick={createContest}> Create Contest</button>
            <p className='past-contests-header'></p>
            <h3 className='past-contests-header'> Past Contests </h3>

            { loading? <p className='loading'><i>Loading...</i></p> : null }
            
            <table className='list-container'>
                <tr className='table-header-row'>
                    <th> Contest </th>
                    <th> Owner </th>
                    <th> Start Date</th>
                    <th> Signups </th>
                </tr>
            {
                // give edit option to each contest 
                Object.keys(contestsList).map(key=>{
                    return (
                        <tr>
                            <td><a className='contest-link' href={`/contests-page/${key}`}>{contestsList[key]} </a> </td>
                            <td><p className='contest-owner'>-owner-</p></td>
                            <td><p className='contest-time'>-start-date-</p></td>
                            <td><p className='contest-signups'> ---- </p></td>
                            <td><button className='edit-button' onClick={()=> to_edit(key)}> Edit </button></td>
                        </tr>
                    )
                })
            }
            </table>
        </div>
    )
}