import React, {useState} from 'react'
import axios from 'axios'

export default function SignUp(){

    const[user, setUser] = useState({
        username:'',
        email:'',
        password:''
    })

    const signup = (e)=>{
        e.preventDefault()

        axios.post('http://localhost:8000/auth/signup', user)
        .then(response=>{
            if(response.data.message==='ok'){
                alert("Account Created Successfully.")
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const handleChange = (e)=>{
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }
    return(
        <div>
            <div className='log-form'>
                <h2> Create Account </h2>
                <form onSubmit={signup}>
                    <input type='text' name='username' placeholder="Enter username" onChange={handleChange} /> <br />
                    <input type='text' name='email' placeholder='Enter email' onChange={handleChange} /> <br />
                    <input type='text' name='password' placeholder='Enter password' onChange={handleChange}/> <br />
                    <br />
                    <button type='submit'>Sign Up</button>
                </form>
            </div>
        </div>
    )
}