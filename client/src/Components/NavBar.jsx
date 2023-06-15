import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './NavBar.css'


export default function NavBar(){
    return(
        <div className='navbar'>
            <nav>   
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/administration">Administration</a></li>
                    {/* <li><a href="/challenges">Challenges</a></li> */}
                    <li><a href="/freemode">FreeMode</a></li>
                    <li><a href="/signout">SignOut</a></li>
                </ul>
            </nav>  
        </div>
    )
}
