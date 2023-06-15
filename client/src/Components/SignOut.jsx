import React from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

export default function SignOut(){
    const navigate = useNavigate();

    const handleSignOut= (e)=>{
        e.preventDefault()
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('username')
        delete axios.defaults.headers.common['Authorization']

        navigate('/') 
        window.location.reload()
    }

    return(
        <>
        <p>{`hi ${localStorage.getItem('username')}`} </p>
        <button type='submit' onClick={handleSignOut} >SignOut</button>
        </>
    )
}