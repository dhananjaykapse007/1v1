import React, {useState, useEffect} from 'react'
import { useNavigate  } from 'react-router-dom'
import axios from 'axios'
import './ManageChallenges.css'


export default function ManageChallenges(){
    const nav = useNavigate()
    const [challengesList, setChallengesList] = useState(new Map())
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        axios({
            method: 'post',
            url:"http://localhost:8000/challenges/user-challenges",
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            data:{
                owner: localStorage.getItem('username')
            }
        })
        .then(result=>{
            console.log(typeof result.data.data.challenges);          
            setChallengesList(result.data.data.challenges)
            setLoading(false)
        })
        .catch(err=>{
            console.log(err)
        })
    }, [])

    const createChallenge = ()=>{
        axios({
            method:'post',
            url:'http://localhost:8000/challenges/create',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            data:{
                owner: localStorage.getItem('username')
            }
        })
        .then(res=>{
            console.log(res.data)
            const cnt = res.data.cnt;
            nav(`/challenges/${cnt}/edit`)
        })
        .catch(err=>{
            console.log(err)
        })
    }


    const to_edit = (key)=>{
        nav(`/challenges/${key}/edit`)
    }

    const del_challenge = (key)=>{

    }

    return(
        <div className='man-ch-div'>
            <button id='create-ch-button' onClick={createChallenge}> Create Challenge </button>
            <h3 className='past-ch-header'> Past Challenges </h3>

            { loading ? <p className='loading'> <i>Loading...</i></p> : null }

            <table className='ch-list-container'>
                <tr className='ch-list-header-row'>
                    <th> Challenge </th>
                    <th> Owner </th>
                </tr>
            
            {

                Object.keys(challengesList).map(key=>{
                    return(
                        <tr>
                            <td><a className='ch-link' href={`/challenges-page/${key}`}>{challengesList[key]}</a> </td>
                            <td><p className='ch-owner'>--owner--</p></td>
                            <td><button className='ch-edit-button' onClick={()=> to_edit(key)}>Edit</button></td>
                        </tr>
                    )
                })
                // Object.keys(challengesList).map(key=>(
                //     <div key={key}>
                //         <a href={`/challenges-page/${key}`}>{key} {challengesList[key]} </a>
                //         <button><a href={`challenges/${key}/edit`}> Edit </a></button> 
                //     </div>
                // ))
            }

            </table>

        </div>
    )
}