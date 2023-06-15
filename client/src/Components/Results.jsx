import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './Results.css'


const Results = React.memo(({roundResults})=>{
    const [isResult, setIsResult] = useState(false)
    const [activeTab, setActiveTab] = useState(1)         // Round 1
    
    useEffect(()=>{
        if(roundResults.length!==0 && roundResults[0].round!==0) setIsResult(true)
    }, [roundResults])


    const displayTabs = ()=>{
        return (                        
            // render tabs for rounds
            <div className='rounds-tabs'>
                {
                    roundResults.map((res, index)=>{
                        return(
                            <button className='tab-button' onClick={()=> setActiveTab(index+1)}> Round {index+1} </button>
                        )
                    })
                }
            </div>
        )
    }

    
    const renderResults = ()=>{

        return (
            roundResults.map((result, index)=>{        // for all rounds 
                if(index===(activeTab-1)){
                    return(
                        <div className='results-table' key={result.round}>
                            <h5 className='which-round'> Round {result.round} </h5>
                            <p> {result.isDone ? null : <i>results undeclared...</i>} </p>
                            {
                                Object.keys(result.table).map((key, index)=>{
                                    if(index%2==1) return null                  // skipping the odd positions
            
                                    const player1_obj = result.table[key]       // object
                                    const player1 = key
                                    const player2 = player1_obj.opponents.slice(-1)[0].opp
                                    const winner = player1_obj.opponents.slice(-1)[0].result;
            
                                    if(winner==='W'){
                                        return <p><u>{player1}</u> v/s {player2} </p>
                                    }
                                    else if(winner==='L'){
                                        return <p>{player1} v/s <u>{player2}</u></p>
                                    }
                                    else{
                                        // draw
                                        return <p> {player1} v/s {player2} {result.isDone? '(Draw)' : null }</p>     
                                    }   
                                    
                                    
                                })
                            }
                        </div>
                    )
                }
            })   
        )
    }

    
    return(
        <div className='results'>
            <div className='results-box'>
                <h4 className='card-header'>Results</h4>
                <hr style={{margin: '10px 20px 10px 20px'}}/>
    
                { isResult ? (
                    <div className='results-container'>                    
                        { displayTabs() }   
                        { renderResults() }
                    </div>
                    )
                    : 
                    <p style={{marginLeft: '20px', fontFamily: 'Calibri', fontSize: '19px'}}><i>No data to display.</i></p>
                }
            </div>
        </div>
    )

})


export default Results;