require('dotenv').config();

const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const cors = require('cors')
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sockets = require('./socketid_manager')

const authRouters = require('./routes/auth.routes')
const userRouters = require('./routes/user.routes')
const challengeRouters = require('./routes/challenge.routes')
const contestRouters = require('./routes/contest.routes');
const freemodeRouters = require('./routes/freemode.routes')
const resetRouters = require('./routes/reset.routes')
const { nextTick } = require('process');

const app = express()
app.use(body_parser.urlencoded({extended:true}))
app.use(express.json())

const server = http.createServer(app)
const io = socketIO(server, {
    cors:{
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
})          // form a socket.io connection
// socketHandler(io)                 // handle the events and connection

app.use(cors())
// app.set('io', io)


// database connection
mongoose.connect(process.env.MONGO_URI, (err)=>{
    if(err) console.log("Error in connecting to the mongodb: ", err);
    else{
        console.log("Database connection formed");
        server.listen(process.env.PORT, ()=>{
            console.log("Server listening\nClick this link", `http://localhost:${process.env.PORT}`);
        });
    }
})

app.get('/', (req, res)=>{
    res.send('Connected')
})

// app.use('/auth', authRouters)
app.use('/freemode', freemodeRouters)
app.use('/rs', resetRouters)            // dev purpose only


//-----------

function isAuth(req, res, next){
    if(req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1]
        if(token!=='undefined') next()
    }
    else{
        res.json({
            message:'unauthorized'
        })
    }
}

app.use('/auth', authRouters)
app.use('/user', userRouters)
app.use('/challenges',isAuth , challengeRouters)
app.use('/contest',isAuth, contestRouters)

app.get('/auth-failure', (req, res)=>{
    res.json({
        message: 'unauthorized'
    })
})


io.on('connection', (socket)=>{
    console.log('clientC: ', socket.id)
    let user= '';

    socket.on('client-data', (data)=>{
        sockets.setSocket(data.username, socket)
        // console.log('sockets:: ', sockets.sockets)
        user=data.username           // to use it for removing
    })

    // app.set('socket', socket)

    socket.on('disconnect', ()=>{
        console.log("clientD: ", socket.id)
        sockets.delSocket(user)
    })
})