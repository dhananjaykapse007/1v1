import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import ChallengeDetails from './ChallengeDetails'
import ChallengeModerators from './ChallengeModerators'
import ChallengeTestCases from './ChallengeTestCases' 
import ChallengeDelete from './ChallengeDelete'
import PageNotFound from './PageNotFound';
import './EditChallenge.css'


export default function EditChallenge(){
    const {ch_id} = useParams();
    const [title, setTitle] = useState('')
    // const [moderatorsList, setModeratorsList] = useState([])
    const [render404, setRender404] = useState(true)
    const [activeTab, setActiveTab] = useState('details')
    const [formData, setFormData] = useState({})

    useEffect(()=>{
        // for contest title
        axios({
            method: 'get',
            url:`http://localhost:8000/challenges/${ch_id}`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(response=>{
            if(response.data.message==='ok'){
                setRender404(false)
                setTitle(response.data.challenge_details.title)
            }
        })
        .catch(er=>{
            console.log(er)
        })
    }, [])

    const save_changes = (formData)=>{
        setFormData({
            ...formData,
        })
    }


    const save_changes_db = ()=>{
        const start= new Date(formData.start_time)
        const end = new Date(formData.end_time )

        
        if(end<start){
            alert("End time is not valid.")
        }
        else{
            axios({
                method: 'put',
                url:`http://localhost:8000/challenges/${ch_id}/update`,
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                },
                data:{
                    data:formData,
                    owner: localStorage.getItem("username")
                }
            })
            .then(update=>{
                // console.log(update)
                alert("Changes saved successfully.")
                setTitle(formData.title)
                refresh_preview()
            })
        }
    }

    const render_tab = ()=>{
        switch(activeTab){
            case 'details':
                return <ChallengeDetails ch_id={ch_id} save_changes={save_changes} />
            case 'moderators':
                return <ChallengeModerators ch_id={ch_id} />;
            case 'testcases':
                return <ChallengeTestCases ch_id={ch_id} />;
            default:
                return null
        }
    }


    const refresh_preview = ()=>{
        const iframe = document.querySelector('iframe')
        iframe.contentWindow.location.reload()
    }


    return(
        <div className='challenge-overview'>

            {render404 ? <PageNotFound /> : 
            (
                <>
                    <h3 id='title' ><a id='title' href={`/challenges-page/${ch_id}`}> {title} </a></h3>
                    <p id='customize-label'><i>Challenge Customization</i></p>
                    <hr />

                    <div className='container'>

                        <div className='editor-panel'>
                            <div className='tabs'>
                                <button className='tab-link' onClick={()=> setActiveTab('details')}> Details</button>
                                <button className='tab-link' onClick={()=> setActiveTab('moderators')}> Moderators </button>
                                <button className='tab-link' onClick={()=> setActiveTab('testcases')}> TestCases </button>
                            </div>

                            <div className='tab-content'>
                                { render_tab() }
                                { activeTab==='details' ? <ChallengeDelete ch_id={ch_id} /> : null }
                            </div>
                            <button id='save-button' onClick={save_changes_db} disabled={ activeTab!=='details' ? true : false }> Save Changes </button>
                        </div>


                        <div className='vertical-line'></div>


                        <div className='preview-panel'>
                            <iframe className='vertical-iframe' src={`/challenges-page/${ch_id}/preview`} frameborder="0"></iframe>
                            <button id='refresh-button' onClick={refresh_preview} disabled={ activeTab!=='details' ? true: false}> Refresh </button>
                        </div>


                    </div>
                </>
            )
            }
            
        </div>
    )
}

