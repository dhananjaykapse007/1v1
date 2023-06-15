import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'
import './PreviewContest.css'


export default function ContestPage(){
    const {cnt} = useParams()

    const [contest, setContest] = useState({
        title: '',
        type:'',
        description:'',
        start_time:'',
        end_time:'',
        rules:'',
        scoring:''
    })

    useEffect(()=>{
        axios({
            method: 'get',
            url: `http://localhost:8000/contest/${cnt}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(details=>{
            const start_utc_date = new Date(details.data.body.start_time)
            const start_ist_date = start_utc_date.toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})
            const end_utc_date = new Date(details.data.body.end_time)
            const end_ist_date = end_utc_date.toLocaleString("en-US", {timeZone: 'Asia/Kolkata'})

            setContest({
                ...contest,
                title: details.data.body.title,
                type:details.data.body.type,
                description: details.data.body.description,
                start_time: start_ist_date,
                end_time: end_ist_date,
                rules: details.data.body.rules,
                scoring: details.data.body.scoring 
            })
        })
        .catch(error=>{
            console.log(error)
        })
    }, []);



    return(
        <div>        
            <h3 id='preview-contest-title'>{contest.title}
            <hr /> </h3>

            <p className='preview-details'>{contest.description}</p> <br />
            <br />


            <h4 className='preview-headers'> Contest Type: </h4>
            <p className='preview-details'> {contest.type} </p>

            <h4 className='preview-headers'> Start Time: </h4>
            <p className='preview-details'> {contest.start_time}</p>
            
            <h4 className='preview-headers'> End Time: </h4>
            <p className='preview-details'> {contest.end_time}</p>

            <h4 className='preview-headers'> Rules: </h4>
            {/* <p className='details'> {contest.rules}</p> */}
            <p className='preview-rules' dangerouslySetInnerHTML={{ __html: contest.rules }}></p>

            <h4 className='preview-headers'> Scoring: </h4>
            <p className='preview-scoring'> {contest.scoring}</p>
            
            <hr />

            <p id='preview-registration-note'><b> Note: </b><i>Registrations will be closed before 5 minutes to the start of contest.</i></p>

        </div>
    )
}