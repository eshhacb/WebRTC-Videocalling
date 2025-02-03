import React,{useEffect, useCallback} from 'react';
import { useSocket } from '../providers/Socket';
import { usePeer } from '../providers/Peer';

const RoomPage = () => {
    const {socket}=useSocket();
    const {peer, createOffer} =usePeer();

    const handleNewUserJoined=useCallback(
      async(data)=>{
      const {emailId}=data;
      console.log('New user joined room', emailId);
      const offer=await createOffer();
      socket.emit('call-user',{emailId,offer})
    },[createOffer,socket]
  );

    const handleIncomingCall=useCallback((data)=>{
      const {from,offer}=data;
      console.log("Incoming Call from",from,offer);

    },[])

    useEffect(()=>{
      socket.on('user-joined',handleNewUserJoined);
      socket.on('incoming-call',handleIncomingCall);

      return ()=>{
        socket.off('user-joined',handleNewUserJoined);
        socket.off('incoming-call',handleIncomingCall);
      }
    },[socket,handleNewUserJoined]);

  return (
    <div>Room Page</div>
  )
}

export default RoomPage;