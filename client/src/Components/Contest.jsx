// import React, {useState} from 'react'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import EditContest from './EditContest'


// // terms and conditions page mainly




// export default function Contest(){
//     const navigate = useNavigate();
//     const [pageLoaded, setPageLoaded] = useState(false)
//     const [formData, setFormData] = useState({
//         title:'',
//         start_time:'',
//         end_time:'',
//         description:'',
//         rules:'',
//         scoring:''
//     })


//     const handleSubmit=(e)=>{   
//         e.preventDefault();
//         // console.log(formData)

//         axios.post('http://localhost:8000/contest/create', formData)
//         .then(response=>{
//             if(response.data.message === 'ok'){
//                 console.log("message ok received")
//                 const cnt = response.data.cnt;       // cnt is contest attribute
//                 navigate(`/contest/${cnt}/edit`)
//             }
//             else{
//                 // contest creation failed
//                 console.log('not ok')
//             }
//         })
//         .catch(error=>{
//             // handle error
//         })
//     }

//     const inputChange = (e)=>{
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         })
//     }

//     if(pageLoaded){
//         return(
//             <EditContest />
//         )
//     }

//     return(
//         <div className='challenge'>
//             <h2> Contest Details </h2>
        
//             <form onSubmit={handleSubmit}>
//                 <label for='contest_name'> Contest Name:  </label> 
//                 <input type='text' name="title" onChange={inputChange}/> <br />

//                 <label for='start_time'> Start Time:  </label> 
//                 <input type='text' name="start_time" onChange={inputChange} /> <br />

//                 <label for='end_time'> End Time:  </label> 
//                 <input type='text' name="end_time" onChange={inputChange}/> <br />

//                 <label for='description'> Description:  </label> 
//                 <input type='text' name="description" onChange={inputChange}/> <br />

//                 <label for='rules'> Rules:  </label> 
//                 <input type='text' name="rules" onChange={inputChange}/> <br />

//                 <label for='scoring'> Scoring:  </label> 
//                 <input type='text' name="scoring" onChange={inputChange}/> <br />

//                 <button type='submit'> Create </button>

//             </form>
//         </div>
//     )
// }