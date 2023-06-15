import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import ContestDetails from './ContestDetails'
import ContestModerators from './ContestModerator'
import ContestChallenges from './ContestChallenges'
import ContestSignups from './ContestSignups'
import ContestNotifications from './ContestNotifications';
import ContestDelete from './ContestDelete'
import PageNotFound from './PageNotFound'
import './EditContest.css'


export default function EditContest(){
    const {cnt} = useParams()

    const [render404, setRender404] = useState(true)
    const [title, setTitle] = useState('')
    const [activeTab, setActiveTab] = useState('details')
    const [formData, setFormData] = useState({})
    const [moderators_list, setModeratorsList] = useState([])

    useEffect(()=>{
        // for contest title
        axios({
            method: 'get',
            url:`http://localhost:8000/contest/${cnt}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(response=>{
            if(response.data.body){
                setRender404(false)
                setTitle(response.data.body.title)
                setModeratorsList(response.data.body.moderators)
            }
        })
        .catch(er=>{
            console.log(er)
        })
    }, [])


    const save_changes = (formData)=>{
        setFormData({
            ...formData,
            // [e.target.name]: e.target.value
        })

    }
    
    
    const save_changes_db = ()=>{
        // console.log('save_changes_db: ', formData)
        // e.preventDefault();
        const start= new Date(formData.start_time)
        const end = new Date(formData.end_time )

        
        if(end<start){
            alert("End time is not valid.")
        }
        else{
            axios({
                method: 'put',
                url:`http://localhost:8000/contest/${cnt}/update`,
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                data:{
                    data:formData,
                    owner: localStorage.getItem("username")
                }
            })
            .then(update=>{
                console.log(update)
                alert("Changes saved successfully.")
                setTitle(formData.title)
                refresh_preview()
            })
        }
    }

    
    const render_tab = ()=>{
        switch(activeTab){
            case 'details':
                return <ContestDetails cnt={cnt} save_changes={save_changes} />;
            case 'moderators':
                return <ContestModerators cnt={cnt} />;
            case 'challenges':
                return <ContestChallenges cnt={cnt} />;
            case 'signups':
                return <ContestSignups cnt={cnt} />
            case 'notifications':
                return <ContestNotifications cnt={cnt} />
            default:
                return null
        }
    }


    const refresh_preview = ()=>{
        const iframe = document.querySelector('iframe')
        iframe.contentWindow.location.reload()
    }

    return(
        <div className='contest-overview'>

            { render404 ? <PageNotFound /> : 
            (
                <>
                    <h3 id='title' ><a id='title' href={`/contests-page/${cnt}`}> {title} </a></h3>
                    <p id='customize-label'><i>Contest Customization</i></p>
                    <hr />

                    <div className='container'>

                        <div className='editor-panel'>
                            <div className='tabs'>
                                <button className='tab-link' onClick={()=> setActiveTab('details')}> Details</button>
                                <button className='tab-link' onClick={()=> setActiveTab('moderators')}> Moderators </button>
                                <button className='tab-link' onClick={()=> setActiveTab('challenges')}> Challenges</button>
                                <button className='tab-link' onClick={()=> setActiveTab('signups')}> Signups</button>
                                <button className='tab-link' onClick={()=> setActiveTab('notifications')}> Notifications</button>
                            </div>

                            <div className='tab-content'>
                                { render_tab() }
                                { activeTab==='details' ? <ContestDelete cnt={cnt} /> : null } 
                            </div>
                            <button id='save-button' onClick={save_changes_db} disabled={ activeTab!=='details' ? true : false }> Save Changes </button>
                        </div>


                        <div className='vertical-line'></div>


                        <div className='preview-panel'>
                            <iframe className='vertical-iframe' src={`/contests-page/${cnt}/preview`} frameborder="0"></iframe>
                            <button id='refresh-button' onClick={refresh_preview} disabled={ activeTab!=='details' ? true: false}> Refresh </button>
                        </div>


                    </div>
                </>
            )}


        </div>
    )
}