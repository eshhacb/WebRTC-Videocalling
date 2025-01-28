import express from 'express';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';

const io=new Server({
    cors:true, //allows cross domain data transfer
});
const app=express();

app.use(bodyParser.json());

const emailToSocketMapping= new Map();

io.on('connection',(socket)=>{
    console.log("New Connection");
    socket.on('join-room',(data)=>{
        const {roomId,emailId}=data;
        console.log("User", emailId,"Joined Room", roomId);
        emailToSocketMapping.set(emailId,socket.id);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-joined",{emailId});
    })
});

app.listen(5000,()=>console.log("Http server at port 5000"));
io.listen(5001);