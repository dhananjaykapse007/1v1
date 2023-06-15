import React from 'react'
import './About.css'

export default function About(){
    return(
        <body>

        <div>
            <h3 className='gen-title'> Overview: </h3>
            <p className='info'>Our platform is designed to facilitate 1v1 programming contests using the Swiss-based format.  </p>

            <h4 className='gen-title'> Key Features: </h4>

            <p className='info-title'> <b>Swiss-based Format:</b> </p>
            <p className='info'>Our platform follows the Swiss-based tournament format, which ensures fair matchups by pairing participants with similar skill levels in each round. This format allows for multiple rounds of competition, providing ample opportunities for participants to demonstrate their abilities and climb the ranks.
            <hr></hr>
            </p>

            <p className='info-title'><b>Customizable Contest Creation:</b></p>
            <p className='info'>As an organizer, you have the flexibility to create and customize contests according to your preferences. You can set the duration, specify the programming languages allowed. Tailor the contests to suit your target audience and the specific skills you want to assess.
            Live Leaderboard: Keep track of participants' progress and rankings after each round is completed. 
            <hr></hr>
            </p>

            <p className='info-title'><b>Code Submissions and Evaluation:</b></p> 
            <p className='info'>Our platform allows participants to submit their code solutions directly within the contest interface. The submissions are automatically evaluated based on correctness and efficiency against predefined test cases. This ensures consistent and objective evaluation of participants' coding skills.
            <hr></hr>
            </p>

            <p className='info-title'><b>Freemode:</b></p>
            <p className='info'>In addition to conducting 1v1 programming contests, we offer a unique freemode feature that allows anyone to run their code and explore various programming concepts in a sandbox environment. Whether you're a beginner looking to experiment with coding or an experienced programmer seeking a space to test algorithms, our freemode provides an open playground for your coding endeavors.
<hr></hr>
</p>        </div>
        </body>
    )
}