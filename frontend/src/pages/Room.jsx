import React,{useEffect, useCallback} from 'react';
import { useSocket } from '../providers/Socket';
import { usePeer } from '../providers/Peer';

const RoomPage = () => {
    const {socket}=useSocket();
    const {peer, createOffer,createAnswers,setRemoteAns} =usePeer();

    const handleNewUserJoined=useCallback(
      async(data)=>{
      const {emailId}=data;
      console.log('New user joined room', emailId);
      const offer=await createOffer();
      socket.emit('call-user',{emailId,offer})
    },[createOffer,socket]
  );

    const handleIncomingCall=useCallback(async(data)=>{
      const {from,offer}=data;
      console.log("Incoming Call from",from,offer);
      const ans=await createAnswers(offer);
      console.log("Generated answer:", ans); // Log generated answer
    console.log("Emitting call-accepted to server");
      socket.emit('call-accepted',{emailId:from,ans});

    },[createAnswers,socket]);

    const handleCallAccepted=useCallback(async(data)=>{
      const {ans}=data;
      console.log("Call got accepted", ans);
      await setRemoteAns(ans);
    },[setRemoteAns])

    useEffect(()=>{
      socket.on('user-joined',handleNewUserJoined);
      socket.on('incoming-call',handleIncomingCall);
      socket.on("call-accepted", handleCallAccepted);

      return ()=>{
        socket.off('user-joined',handleNewUserJoined);
        socket.off('incoming-call',handleIncomingCall);
        socket.off('call-accepted',handleCallAccepted);
      }
    },[socket,handleNewUserJoined,handleIncomingCall,handleCallAccepted]);

  return (
    <div>Room Page</div>
  )
}

export default RoomPage;