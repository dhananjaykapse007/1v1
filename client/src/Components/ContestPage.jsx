import React, {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import axios from 'axios'
import './ContestPage.css'


export default function ContestPage(){
    const {cnt} = useParams()
    const navigate = useNavigate()

    const [contest, setContest] = useState({
        title: '',
        type:'',
        description:'',
        start_time:'',
        end_time:'',
        rules:'',
        scoring:''
    })
    const [registration, setRegistration] = useState(false)
    const [enter, setEnter] = useState(true)
    

    const register=()=>{
        axios({
            method: 'post',
            url: `http://localhost:8000/contest/${cnt}/register`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            data:{
                username: localStorage.getItem('username')
            }
        })
        .then(response=>{
            if(response.data.message==='ok'){
                alert("Registration Successful.")
                window.location.reload()
            }
        })
    }    

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


            const startTime = new Date(details.data.body.start_time).toISOString()
            const endTime = new Date(details.data.body.end_time).toISOString()
            const currentTime= new Date().toISOString()
            const timeDiff= new Date(startTime) - new Date(currentTime)       
            const timeDiff2 = new Date(endTime) - new Date(currentTime)     

            const startDateTime= new Date(details.data.body.start_time)
            const reg_cutoff = new Date(startDateTime - 5*60*1000)

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
            // check if the user is already registered or not

            if(new Date(currentTime)>= new Date(startTime) && new Date(currentTime)<= new Date(endTime)) setEnter(true)

            if(timeDiff >=0){
                setTimeout(()=>{
                    alert("Contest has started")
                    setEnter(true)
                }, timeDiff)
            }
            else if(timeDiff2>=0){
                setTimeout(()=>{
                    alert('Contest has ended')          // this should be while the contest is live on all contest's pages
                    // logout the user
                }, timeDiff2)
            }
            else if(timeDiff2<=0){
            }

            if(details.data.body.participants.includes(localStorage.getItem('username'))){            // && (new Date(currentTime) < new Date(reg_cutoff))
                setRegistration(true)
            }
        })
        .catch(error=>{
            console.log(error)
        })
    }, []);


    const enterDashboard=()=>{
        navigate(`/contest/${cnt}/dashboard`)
    }



    return(
        <div>

            {/* time remaining for the contest to start || already started || ended || ie. contest status */}
        
            <h3 id='contest-title'>{contest.title}
            <hr /> </h3>

            <p className='details'>{contest.description}</p> <br />
            <br />


            <h4 className='headers'> Contest Type: </h4>
            <p className='details'> {contest.type} </p>

            <h4 className='headers'> Start Time: </h4>
            <p className='details'> {contest.start_time}</p>
            
            <h4 className='headers'> End Time: </h4>
            <p className='details'> {contest.end_time}</p>

            <h4 className='headers'> Rules: </h4>
            {/* <p className='details'> {contest.rules}</p> */}
            <p className='rules' dangerouslySetInnerHTML={{ __html: contest.rules }}></p>

            <h4 className='headers'> Scoring: </h4>
            <p className='scoring'> {contest.scoring}</p>
            
            <hr />

            <p id='registration-note'><b> Note: </b><i>Registrations will be closed before 5 minutes to the start of contest.</i></p>
            
            <div id='button'>
                { registration ? null : <button id='register-button' type='submit' onClick={register}> Register </button>}
                { (enter && registration) ? <button id='enter-button' onClick={enterDashboard}> Enter </button> : null }
            </div>

        </div>
    )
}