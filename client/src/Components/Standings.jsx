import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './Standings.css'

export default function Standings({last_round, roundResults}){      // take score, tie-breakers and standings from the roundResults
    const [data, setData] = useState([{         // array of objects
        rank: '',
        participant: '',
        score: '', 
        buchholz: '',
        median_buchholz: '',
        sonneborn_berger:'',
    }])

    useEffect(()=>{
        const total_rounds = roundResults.length;

        for(let i=total_rounds-1; i>=0; i--){
            if(roundResults[i].isDone){                // only details of the last round required
                const table = roundResults[i].table;
                const standings = roundResults[i].standings;
                const data = []

                for(let j=0; j<standings.length; j++){
                    let obj = {
                        rank: j+1,
                        participant: standings[j],
                        score: table[standings[j]].score,
                        buchholz: table[standings[j]].buchholz,
                        median_buchholz: table[standings[j]].median_buchholz,
                        sonneborn_berger: table[standings[j]].sonneborn_berger
                    }

                    data.push(obj)
                }

                setData(data)
                break;
            }
        }
    }, [roundResults])


    const renderStandings = ()=>{

        if(!last_round) return; 

        return (
            <div className='standings-container'>
                <table className='standings-table'>
                    <tr>
                        <th className='st-table-header'> Rank </th>
                        <th className='st-table-header'> Participant </th>
                        <th className='st-table-header'> Score </th>
                        <th className='st-table-header'> Buccholz</th>
                        <th className='st-table-header'> Median Buccholz</th>
                        <th className='st-table-header'> Sonneborn Berger</th>
                    </tr>
                    {/* <div className='standings-content'> */}
                        {
                            data.map((participant, index)=>{
                                return (
                                    <tr>
                                        <td className='st-table-content'>{index+1}</td>
                                        <td className='st-table-content'>{data[index].participant}</td>
                                        <td className='st-table-content'>{data[index].score}</td>
                                        <td className='st-table-content'>{data[index].buchholz}</td>
                                        <td className='st-table-content'>{data[index].median_buchholz}</td>
                                        <td className='st-table-content'>{data[index].sonneborn_berger}</td>
                                    </tr>
                                )
                            })
                        }  
                    {/* </div> */}

                    
                </table>
            </div>
        )
    }

    return(
        <div className='standings'>
            <div className='standings-box'>
                <h3 className='card-header'>Standings</h3>
                <hr style={{margin: '10px 20px 10px 20px'}}/>   

                {/* <p>Current standings for the last completed round.</p> */}

                { last_round ? renderStandings() : <p style={{marginLeft: '20px', fontFamily: 'Calibri', fontSize: '19px'}}><i>No data to display.</i></p>}
            </div>
                
        </div>
    )
}