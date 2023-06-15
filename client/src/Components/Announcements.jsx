import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './Announcements.css'


export default function Announcements({announcements}){
    const [toShow, setToShow] = useState(false)

    useEffect(()=>{
        if(announcements.length) setToShow(true)
    }, [announcements])

    const showAnnouncements = ()=>{
        return (
            <div className='announcements-content'>
                {
                    announcements.map((announcement, index)=>{
                        return (
                            <div>
                                <p>&#x2022; {announcement}</p>
                                <p className='ann-date'><i> # DateTime #</i></p>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    return(
        <div className='announcements'>
            
            <div className='announcement-box'>
                <h3 className='card-header'> Announcements </h3> 
                <hr style={{margin: '10px 20px 10px 20px'}}/>

                { toShow ? showAnnouncements() : <p style={{marginLeft: '20px', fontFamily: 'Calibri', fontSize: '19px'}}><i>No announcements made till now.</i></p>}

            </div>
        </div>
    )
}