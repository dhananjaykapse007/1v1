import React, {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

export default function SignIn(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const signin=(e)=>{
        e.preventDefault()

        const user = {
            username: username,
            password: password
        };

        axios.post('http://localhost:8000/auth/signin', user)
        .then(response=>{
            if(response.data.message==='ok'){
                localStorage.setItem('jwtToken', response.data.token)
                localStorage.setItem('username', response.data.username)
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token
                
                navigate('/')
                window.location.reload()
            }
            else{
                alert(response.data.message)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }


    return(
        <div className='log-form'>
            <h2> Login to Account </h2>
                <input type='text' name='username' placeholder="Enter username" onChange={(e)=> setUsername(e.target.value)} /> <br />
                <input type='text' name='password' placeholder='Enter password' onChange={(e)=> setPassword(e.target.value)} /> <br />
                <br />
                <button type='submit' onClick={signin}>Sign In</button>
        </div>
    )
}