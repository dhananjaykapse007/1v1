import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import './CountDownTimer.css'

const CountdownTimer = ({startTime, cnt, cb}) => {
  const nav = useNavigate()
  const [remainingTime, setRemainingTime] = useState(0); // 20 minutes in seconds
  const [timerExpired, setTimerExpired] = useState(false)

  useEffect(() => {
    const start = new Date(startTime)
    const end = new Date(start.getTime() + 20*60*1000);

    const timer = setInterval(()=>{
      const now = new Date();
      const diff = end - now;

      if(diff<=0){
        clearInterval(timer);
        setRemainingTime(0)
        // alert('Round ended.')
        cb()               // callback to the parent to hide the challenge once the round ends
      }
      else{
        setRemainingTime(Math.floor(diff/1000))
      }
    }, 1000)

    return ()=> clearInterval(timer)
  }, [startTime]);

  // Format the remaining time as minutes and seconds
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  

  // Render the countdown timer
  return (
    <div className='countdown'>
      {minutes < 10 ? '0' : ''}{minutes} : {seconds < 10 ? '0' : ''}{seconds}
    </div>
  );
};

export default CountdownTimer;
