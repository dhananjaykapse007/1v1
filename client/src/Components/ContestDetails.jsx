import React, {useState, useEffect} from 'react'
import axios from 'axios'
import DateTime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import './ContestDetails.css'

export default function ContestDetails({cnt, save_changes}){
    
    const [formData, setFormData] = useState({
        title:'',
        type:'',
        rounds:'',
        round_duration:'',
        start_time:'',
        end_time: '',               
        description:'',
        rules:'',
        scoring:''
    })


    useEffect(()=>{
        axios({
            method:'get',
            url:`http://localhost:8000/contest/${cnt}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(response=>{
            // console.log(`contest ${cnt} details: `, response.data)
            setFormData(response.data.body)
        })
        .catch(err=>{
            console.log(err)
        })
    },[])


    // const handleSubmit=(e)=>{   
        // e.preventDefault();
        // // check for the start and end time of the contest 
        // const start= new Date(formData.start_time)
        // const end = new Date(formData.end_time )

        // console.log('before saving, data: ', formData)
        
        // if(end<start){
        //     alert("End time is not valid.")
        // }
        // else{
        //     axios({
        //         method: 'put',
        //         url:`http://localhost:8000/contest/${cnt}/update`,
        //         headers:{
        //             'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        //         },
        //         data:{
        //             data:formData,
        //             owner: localStorage.getItem("username")
        //         }
        //     })
        //     .then(update=>{
        //         console.log(update)
        //         alert("Changes saved successfully.")
        //         // setFormData(update.data.data)
        //     })
        // }
    // }


    useEffect(()=>{
        save_changes(formData)
    }, [formData])
    

    const inputChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleStartTime= (value) =>{
        const start_date = new Date(value)
        let utc = (start_date.toUTCString());    // mongodb stores datetime in UTC format   

        setFormData({
            ...formData,
            start_time: start_date
        })
    }

    const handleEndTime= (value) =>{
        const end_date = new Date(value)
        setFormData({
            ...formData,
            end_time: end_date
        })
    }


    return(
        <div className='contest'>
            <h2 className='contest-details-header'> Contest Details </h2>
        
            <form>
                <div className='contest-per-div'>
                    <label className='labels' for='contest_name'> Contest Name:  </label> <br />
                    <input className='inputs' type='text' name="title" value={formData.title} onChange={inputChange}/> 
                </div>

                <div className='contest-per-div'>
                    <label className='labels' for='type'> Type: </label> <br />
                    <select className='inputs' name='type' onChange={inputChange}>
                        <option value=''></option>
                        <option value="Knockout" selected={formData.type==='Knockout'}>Knockout</option>
                        <option value="Swiss" selected={formData.type==='Swiss'}>Swiss</option>
                        <option value="Round-robin" selected={formData.type==='Round-robin'}>Round-robin</option>
                    </select>
                </div>

                <div className='contest-per-div'>
                    <label className='labels' for="rounds">Rounds </label><br />
                    <input className='inputs' type='text' name="rounds" value={formData.rounds} onChange={inputChange}/> 
                </div>

                <div className='contest-per-div'>
                    <label className='labels' for="round_duration">Round Duration</label><br />
                    <input className='inputs' type='text' name="round_duration" value={formData.round_duration} onChange={inputChange}/> 
                </div>

                <div className='contest-per-div'>
                    <label className='labels' for='start_time'> Start Time:  </label> <br />
                    <DateTime onChange={handleStartTime} value={new Date(formData.start_time)} dateFormat="YYYY-MM-DD" timeFormat="HH:mm:ss" />
                </div>

                <div className='contest-per-div'>
                    <label className='labels' for='end_time'> End Time:  </label> <br />
                    <DateTime  onChange={handleEndTime} value={new Date(formData.end_time)} dateFormat="YYYY-MM-DD" timeFormat="HH:mm:ss" />
                </div>
                
                <div className='contest-per-div'>
                    <label className='labels' for='description'> Description:  </label> <br />
                    <textarea name='description' value={formData.description} onChange={inputChange} ></textarea>
                </div>

                <div className='contest-per-div'>
                    <label className='labels' for='rules'> Rules:  </label> <br />
                    <textarea name='rules' value={formData.rules} onChange={inputChange}></textarea>
                </div>
                
                <div className='contest-per-div'>
                    <label className='labels' for='scoring'> Scoring:  </label> <br />
                    <textarea name='scoring' value={formData.scoring} onChange={inputChange}></textarea>
                    {/* <input className='long-inputs' type='text' name="scoring" value={formData.scoring} onChange={inputChange}/>  */}
                </div>

            </form>
            {/* <button type='submit'> Save Changes </button> */}
        </div>
    )
}


