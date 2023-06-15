import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Switch, Routes, Route, Link} from 'react-router-dom'
import { useNavigate, useParams } from 'react-router-dom';
import './ChallengeDetails.css'


export default function ContestDetails({ch_id, save_changes}){
    
    const [formData, setFormData] = useState({
        title:'',
        statement:'',
        constraints:'', 
        input_format:'',
        output_format:''
        // owner: 
    })

    useEffect(()=>{
        axios({
            method:'get',
            url:`http://localhost:8000/challenges/${ch_id}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(response=>{
            // console.log(`challenge ${ch_id} details: `, response.data)
            setFormData(response.data.challenge_details)          
        }) 
        .catch(err=>{
            console.log(err)
        })
    }, [])


    // const handleSubmit=(e)=>{   
    //     e.preventDefault();
    //     // PUT this data to this contest doc     
    //     axios({
    //         method: 'put',
    //         url:`http://localhost:8000/challenges/${ch_id}/update`,
    //         headers:{
    //             'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    //         },
    //         data:{
    //             data:formData,
    //             owner: localStorage.getItem('username')
    //         }
    //     })
    //     .then(update=>{
    //         console.log(update)
    //         // setFormData(update.data.data)
    //     })
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


    return(
        <div className='challenge'>
            <h2 className='ch-details-header'> Challenge Details </h2>
        
            <form>
                <div className='ch-per-div'>
                    <label className='labels' for='title'> Problem Title:  </label> <br />
                    <input className='inputs' type='text' name="title" value={formData.title} onChange={inputChange} /> 
                </div>

                <div className='ch-per-div'>
                    <label className='labels' for='statement'> Problem Statement:  </label> 
                    <textarea name='statement' value={formData.statement} onChange={inputChange} ></textarea>
                </div>

                <div className='ch-per-div'>
                    <label className='labels' for='constraints'> Constraints:  </label> 
                    <textarea className='constraints-area' name='constraints' value={formData.constraints} onChange={inputChange} ></textarea>
                </div>

                <div className='ch-per-div'>
                    <label className='labels' for='input_format'> Input Format:  </label> 
                    <textarea className='input-area' name='input_format' value={formData.input_format} onChange={inputChange} ></textarea>
                </div>
                
                <div className='ch-per-div'>
                    <label className='labels' for='output_format'> Output Format:  </label> 
                    <textarea className='output-area' name='output_format' value={formData.output_format} onChange={inputChange} ></textarea>
                </div>

            </form>
        </div>
    )
}


