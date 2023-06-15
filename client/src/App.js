import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom'
import NavBar from './Components/NavBar'
import About from './Components/About'
import Contact from './Components/Contact'
import SignUp from './Components/SignUp'
import SignIn from './Components/SignIn'
import SignOut from './Components/SignOut'
import ContestChallenges from './Components/ContestChallenges'
import Contest from './Components/Contest'
import Administration from './Components/Administration'
import EditContest from './Components/EditContest'
import Challenges from './Components/Challenges'
import EditChallenge from './Components/EditChallenge'
import FreeMode2 from './Components/FreeMode2'
import ChallengesPage from './Components/ChallengesPage'
import ChallengePage from './Components/ChallengePage'
import RoundChallenge from './Components/RoundChallenge'
import ContestsPage from './Components/ContestsPage'
import ContestPage from './Components/ContestPage'
import EnterContest from './Components/EnterContest'
import ContestDashboard from './Components/ContestDashboard'
import Round from './Components/Round'
import PreviewContest from './Components/PreviewContest'
import PreviewChallenge from './Components/PreviewChallenge'


function App() {
  const [user, setUser] = useState({
    auth: localStorage.getItem('jwtToken')? true: false, 
    username: localStorage.getItem('username')? localStorage.getItem('username'): ''
  })

  const isPreview = (pathname)=>{
    return pathname.includes('/preview');
  }

  return (
    <>
    {user.auth? 
      <> 
        <Routes>
            <Route path='/about' Component={About} />
            {/* <Route path='/contact' Component={Contact} /> */}
            {/* <Route path='/signup' Component={SignUp} /> */}
            {/* <Route path='/signin' Component={SignIn} /> */}
            <Route path='/administration' Component={Administration} />
            <Route path='/contest' Component={Contest} />
            <Route path='/contest/:cnt' Component={EnterContest} />
            <Route path='/contest/:cnt/edit' Component={EditContest} />  
            <Route path='/contest/:cnt/dashboard' Component={ContestDashboard} />
            <Route path='/challenges' Component={Challenges} />    
            <Route path='/challenges/:ch_id/edit' Component={EditChallenge} />
            <Route path='/freemode' Component={FreeMode2} />
            {/* <Route path='/challenges-page/' Component={ChallengesPage} /> */}
            <Route path='/challenges-page/:ch_id' Component={ChallengePage} />
            <Route path='/challenges-page/:ch_id/preview' Component={PreviewChallenge} />
            {/* <Route path='/contests-page/' Component={ContestsPage} /> */}
            <Route path='/contests-page/:cnt' Component={ContestPage } />
            <Route path='/signout' Component={SignOut} />
            <Route path='/contest/:cnt/round/:round' Component={Round} />
            <Route path='/contest/:cnt/round/:round/challenge/:ch_id' Component={RoundChallenge} />
            <Route path='/contests-page/:cnt/preview' Component={PreviewContest} />
      </Routes>

        {isPreview(window.location.pathname) ? null : <NavBar /> }
        
      </>

      :
      <>
      <SignIn setUser={setUser} />
      <SignUp />
      </>
    }

    </>
  );
}

export default App;
