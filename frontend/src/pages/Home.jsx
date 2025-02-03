import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import { useSocket } from '../providers/Socket';

const Homepage = () => {
  const {socket}=useSocket();
  const navigate=useNavigate();

  const [email, setEmail]=useState();
  const [roomId, setRoomId]=useState();

  //this acts as an event listener means this get implemented when the emit is called in the backend

  const handleRoomJoined=useCallback(({roomId})=>{
    navigate(`/room/${roomId}`);
  },[navigate]);

  useEffect(()=>{
    socket.on('joined-room',handleRoomJoined);
    return ()=>{
      socket.off('joined-room',handleRoomJoined);
    }
  },[handleRoomJoined,socket]);


  const handleJoinRoom=()=>{
    socket.emit('join-room',{emailId:email, roomId});
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Join a Room</h1>
        <div className="space-y-4">
          <input
            value={email}
            onChange={e=>setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email here"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            value={roomId}
            onChange={e=>setRoomId(e.target.value)}
            type="text"
            placeholder="Enter the room code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button onClick={handleJoinRoom} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
            Enter Room
          </button>
        </div>
      </div>
    </div>
  )
}

export default Homepage
