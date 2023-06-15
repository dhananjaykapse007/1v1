const sockets = {}           // data structure to store socket object of the participants

function setSocket(username, socket){
    sockets[username] = socket;
    // {
    //     _socket: socket,        // one's own socket
    //     opp_socketId: ''         // opponent socket id only
    // }
}

function getSocket(username){
    const socket = sockets[username]
    if(socket===undefined) return -1
    else return socket
}

function delSocket(username){
    delete sockets[username]
}

function notifyAll(participants, msg_group, msg){        // list of participants, ..., message to broadcast
    for(let i=0; i<participants.length; i++){
        const soc = getSocket(participants[i]);
        if(soc!=-1) soc.emit(msg_group, msg);
    }
}

module.exports={
    setSocket,
    getSocket,
    delSocket,
    notifyAll,
    sockets
}
