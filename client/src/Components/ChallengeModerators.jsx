import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './ChallengeModerators.css'

export default function Moderator({ch_id}){
    const [searchModeratorsList, setSearchModeratorsList] = useState([])
    const [preModList, setPreModList] = useState([])

    useEffect(()=>{
        // for fetching moderators from the challenge data
        axios({
            method: 'get',
            url:`http://localhost:8000/challenges/${ch_id}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })  
        .then(response=>{
            // console.log(response.data.challenge_details);
            setPreModList(response.data.challenge_details.moderators)
        })
        .catch(er=>{
            console.log(er)
        })
    }, [])

    const searchUsers = (keyword)=>{
        if(keyword===''){
            setSearchModeratorsList([])
            return;
        }

        axios({
            method:'get',
            url:`http://localhost:8000/user/query?username=${keyword}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(response=>{
            setSearchModeratorsList(response.data.users)
        })
        .catch(er=>{
            console.log(er)
        })
    }


    const addModerator= (username)=>{
        // add moderator to the challenge data

        if(!username) return 
        axios({
            method:'post',
            url:`http://localhost:8000/challenges/${ch_id}/add-moderator`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            data:{
                moderator: username
            }
        })
        .then(response=>{
            if(response.data.message==='ok'){
                alert('ok')
                const updated_list = [...preModList, username]
                setPreModList(updated_list)
            }
        })
        .catch(er=>{
            console.log(er)
        })  
    }


    const removeModerator = (mod)=>{
        // remove the mod from the contest data 
        axios({
            method:'post',
            url: `http://localhost:8000/challenges/${ch_id}/remove-moderator`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            data:{
                moderator: mod
            }
        })
        .then(response=>{
            if(response.data.message==='ok'){
                alert('ok')
                const updated_list = preModList.filter((item)=> item!==mod)
                setPreModList(updated_list)
            }
        })
        .catch(er=>{
            console.log(er)
        })
    }


    return(
        <div className='ch-mod-div'>
            <h2 className='ch-mod-header'> Moderators </h2>
            <p className='ch-i-note'><i> Users with moderator access can edit your challenge.</i></p>
            <input className='ch-search-mod-input' type='text' name='search_moderator' onChange={(e)=> searchUsers(e.target.value)}/> 
            <button className='ch-search-mod-button' onClick={()=> addModerator('')} > Add </button>

            <ul className='users-list'>
                {
                    searchModeratorsList.map((username)=>{
                        return <li key={username} onClick={()=> addModerator(username)}>{username}</li>
                    })
                }
            </ul>
    
            <h3 className='ch-current-mod-header'>Current Moderators</h3>

            {
                preModList.map((mod)=>{
                    
                    return (
                        <div className='mod-list-item'>
                            <p className='mod'> {mod} </p>
                            <button className='mod-rem-button' onClick={()=> removeModerator(mod)}> Remove </button>
                        </div>
                    )
                })
            }
            

        </div>
    )
}