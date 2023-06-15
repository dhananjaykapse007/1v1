const User = require('../models/userModel')


exports.find_users = async function(req, res){         // finding all the usernames for the given keyword
    const search_query= req.query.username
    
    try{
        User.find({username: {$regex: search_query, $options: 'i'}})
        .then(response=>{
            const docs = response.map((doc, index)=>{
                return doc.username
            })

            // console.log('dcos', docs)

            res.json({
                'message': 'ok',
                'users': docs
            })
        })
        .catch(er=>{
            console.log(er)
        })
    }catch(er){
        console.log('error in finding the users')
    }
}


