import React, {useEffect, useState} from 'react'
import axios from 'axios'
import './ContestModerator.css'


export default function Moderator({cnt}){
    const [searchModeratorsList, setSearchModeratorsList] = useState([])     // returned results from the search query
    const [preModList, setPreModList] = useState([])                        // already moderators of the contest
    
    useEffect(()=>{
        // for moderators details from the contest data
        axios({
            method: 'get',
            url:`http://localhost:8000/contest/${cnt}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(response=>{
            setPreModList(response.data.body.moderators)
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
        // add moderator to the database of this contest
        if(!username) return
        axios({
            method:'post',
            url:`http://localhost:8000/contest/${cnt}/add-moderator`,
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
            url: `http://localhost:8000/contest/${cnt}/remove-moderator`,
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
        <div className='moderator-div'>
            <h2 className='moderator-header'> Moderators </h2>
            <p className='i-note'><i> Users with moderator access can edit your contest.</i></p>
            <input className='search-mod-input' type='text' name='search_moderator' onChange={(e)=> searchUsers(e.target.value)}/> 
            <button className='search-mod-button' onClick={()=> addModerator()}> Add </button>

            <ul className='users-list'>
                {
                    searchModeratorsList.map((username)=>{
                        return <li key={username} onClick={(e)=> addModerator(username)}>{username}</li>
                    })
                }
            </ul>
    
            <h3 className='current-mod-header'>Current Moderators</h3>
            
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