import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Contest from './Contest'
import {Routes, Route, Link, useNavigate} from 'react-router-dom'
import ManageContests from './ManageContests'
import ManageChallenges from './ManageChallenges'
import './Administration.css'

export default function Administration(){
    const [activeTab, setActiveTab] = useState('manage-contests');         // manage contest or challenges


    const render_tab = ()=>{
        switch(activeTab){
            case 'manage-contests':
                return <ManageContests />
            case 'manage-challenges':
                return <ManageChallenges />
            default:
                return null
        }
    }


    return(
        <div>
            <h3 className='administration-header'> Administration</h3>

            <div className='manage-container-div'>
                <div className='manage-tabs'>
                    <button className='manage-tab' onClick={()=> setActiveTab('manage-contests')}>Manage Contests</button>
                    <button className='manage-tab' onClick={()=> setActiveTab('manage-challenges')}>Manage Challenges</button>
                </div>
                <hr />  
            </div>

            <div className='manage-tab-content'>
                { render_tab() }
            </div>

        </div>
    )
}