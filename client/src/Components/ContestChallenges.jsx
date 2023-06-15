import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import './ContestChallenges.css'


function AddChallengeModal(props){         // has props.cnt and props.contestChallenges
    const [searchText, setSearchText] = useState('')

    const handleSearchTextChange = (e)=>{
        setSearchText(e.target.value)
    }

    const setChallenge=(key, title)=>{
        //add challenge to the contest challenges_list

        axios({
            method: 'post',
            url:`http://localhost:8000/contest/${props.cnt}/add-challenge`,
            headers:{
                'Authorization':`Bearer ${localStorage.getItem('token')}`
            },
            data:{
                owner: localStorage.getItem("username"),
                cnt_id: key,
                challenge_title: title
            }
        })
        .then(response=>{
            // console.log(props.contestChallenges)
            // window.location.reload() // instead add it to the list and render that list
            const updated_list = [ ...props.contestChallenges, { key: key, title: title } ];
            props.setContestChallenges(updated_list)
        })
        .catch(err=>{
            console.log(err)
        })
    }


    const handleSearchSubmit=(e)=>{
        e.preventDefault()  
        // search for the challenge
        // currently only search for the cnt of the challenge whether present in the user challenges list or not
        axios({
            method:"post",
            url: `http://localhost:8000/challenges/user-challenges`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data:{
                owner: localStorage.getItem('username')
            }
        })
        .then(response=>{
            let found =false
            for(let key in response.data.data.challenges){
                if(key==searchText) {
                    alert(`Challenge: ${response.data.data.challenges[key]}`)
                    found = true
                    setChallenge(key, response.data.data.challenges[key])
                    break;
                }
            }

            if(!found) alert("Not found.")
        })
        .catch(err=>{
            console.log(err)
        })
    }


    return(
        <div>
            <h3 className='search-ch-tag'>Search for Challenges</h3>
            <form onSubmit={handleSearchSubmit}>
                <input className='search-ch-input' type='text' value={searchText} onChange={handleSearchTextChange} />
                <button className='search-ch-button' type='submit'> Add </button>
            </form>
        </div>
    )
}

export default function ContestChallenges({ cnt }){
    const nav = useNavigate()

    const [contestChallenges, setContestChallenges] = useState([])
    
    useEffect(()=>{
        // fetch challenges from the contest data
        axios({
            method: 'post',
            url: `http://localhost:8000/challenges/contest-challenges`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data:{
                contest_id: cnt,
            }
        })
        .then(response=>{
            // console.log('added challenges: ',response.data)
            setContestChallenges(response.data.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }, [])


    const edit_ch_page = (ch_cnt)=>{
        nav(`/challenges/${ch_cnt}/edit`)
    }

    const removeChallenge = (challenge_id)=>{
        // remove challenge from the contest 
        axios({
            method: 'post',
            url:`http://localhost:8000/contest/${cnt}/remove-challenge`,
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data:{
                challenge_id: challenge_id
            }
        })
        .then(response=>{
            if(response.data.message==='ok'){
                alert('ok')
                const updated_list = contestChallenges.filter((item)=> item.cnt !== challenge_id )
                setContestChallenges(updated_list);
            }
        })
    }


    return(
        <div className='challenges-div'>
            <h2 className='challenges-header'> Challenges </h2>
            <p className='i-ch-note'><i>Add challenges to your contest by adding from your own collection. Create and add your own challenges <a href='/challenges'>here</a>.</i></p>
            
            {/* <button className='add-ch-button' onClick={displayModal}>Add Challenge</button> */}
            {/* {showModal && <AddChallengeModal onClose={closeModal} cnt={cnt} />} */}

            <AddChallengeModal cnt={cnt} contestChallenges={contestChallenges} setContestChallenges={setContestChallenges}/>

            <h4 className='add-ch-header'> Added Challenges</h4>

            <table className='ch-list-container'>
                <tr className='ch-list-header-row'>
                    <th> Challenge </th>
                    <th> Owner </th>
                </tr>

            {
                Object.values(contestChallenges).map(ele=>{              // as this is a function so we need to return (if we've use () instead of {}, no need of return statement)
                    return (
                        <tr>
                            <td><a className='ch-link' href={`/challenges-page/${ele.cnt}`}>{ele.title} </a></td>
                            <td><p className='ch-owner'>--</p></td>
                            <td><button className='ch-edit-button' onClick={()=> edit_ch_page(ele.cnt)}> Edit</button> </td>
                            <td><button className='ch-rem-button' onClick={()=> removeChallenge(ele.cnt)}>Remove</button></td>
                        </tr>
                    )
                })
            }
            
            </table>
        </div>
    )
}