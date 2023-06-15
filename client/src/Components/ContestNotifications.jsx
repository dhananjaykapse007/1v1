import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './ContestNotifications.css'


export default function ContestNotifications({cnt}){
    const [announcement, setAnnouncement] = useState('');
    const [prevAnnouncements, setPrevAnnouncements] = useState([]);          

    useEffect(()=>{
        // fetch all the notifications about the contest from the contest data
        axios({
            method: 'get',
            url:`http://localhost:8000/contest/${cnt}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(response=>{
            // console.log(response)
            setPrevAnnouncements(response.data.body.announcements)
        })
        .catch(er=>{
            console.log(er)
        })
    }, [])


    const _notify = ()=>{
        // push notification
        axios({
            method: 'post',
            url:`http://localhost:8000/contest/${cnt}/announce`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            data:{
                announcement: announcement
            }
        })
        .then(response=>{
            // console.log(response)
            if(response.data.message==='ok'){
                setPrevAnnouncements([...prevAnnouncements, announcement])
            }
        })
        .catch(er=>{
            console.log(er)
        })
    }


    return(
        <div className='contest-notify-div'>
            <h3 className='contest-notify-header'> Notifications</h3>
            <p className='contest-notify-note'><i>Notify any details about the contest.</i></p>

            <textarea className='contest-notify-textarea' onChange={(e)=> setAnnouncement(e.target.value)}></textarea>
            <button className='notify-button' onClick={()=> _notify()} > Notify </button>

            <h4 className='prev-notifications-header'>Previous Notifications</h4>
            <div className='prev-notifications-div'>
                {
                    prevAnnouncements.slice().reverse().map((note, index)=>{
                        return <p> {note} </p>
                    })
                }
            </div>


        </div>
    )
}