import React,{useEffect, useCallback,useState} from 'react';
import ReactPlayer from 'react-player';
import { useSocket } from '../providers/Socket';
import { usePeer } from '../providers/Peer';

const RoomPage = () => {
    const {socket}=useSocket();
    const {peer, createOffer,createAnswers,setRemoteAns,sendStream,remoteStream} =usePeer();

    const [myStream,setMyStream]=useState(null);
    const [remoteEmailId,setRemoteEmailId]=useState(null);

    const handleNewUserJoined=useCallback(
      async(data)=>{
      const {emailId}=data;
      console.log('New user joined room', emailId);
      const offer=await createOffer();
      socket.emit('call-user',{emailId,offer});
      setRemoteEmailId(emailId);
    },[createOffer,socket]
  );

    const handleIncomingCall=useCallback(async(data)=>{
      const {from,offer}=data;
      console.log("Incoming Call from",from,offer);
      const ans=await createAnswers(offer);
      console.log("Generated answer:", ans); // Log generated answer
    console.log("Emitting call-accepted to server");
      socket.emit('call-accepted',{emailId:from,ans});
      setRemoteEmailId(from);

    },[createAnswers,socket]);

    const handleCallAccepted=useCallback(async(data)=>{
      const {ans}=data;
      console.log("Call got accepted", ans);
      await setRemoteAns(ans);
    },[setRemoteAns]);

    //fetching stream
    const getUserMediaStream=useCallback(async()=>{
      const stream=await navigator.mediaDevices.getUserMedia({
        audio:true,
        video:true,
      });
      setMyStream(stream);
    },[]);

    
       const handleNegotiation=useCallback(()=>{
        const localOffer=peer.localDescription;
        socket.emit('call-user',{emailId:remoteEmailId,offer:localOffer});
       },[peer.localDescription,remoteEmailId,socket]);

    useEffect(()=>{
      socket.on('user-joined',handleNewUserJoined);
      socket.on('incoming-call',handleIncomingCall);
      socket.on("call-accepted", handleCallAccepted);

      // return ()=>{
      //   socket.off('user-joined',handleNewUserJoined);
      //   socket.off('incoming-call',handleIncomingCall);
      //   socket.off('call-accepted',handleCallAccepted);
      // }
    },[socket,handleNewUserJoined,handleIncomingCall,handleCallAccepted]);

    useEffect(()=>{
      peer.addEventListener('negotiationneeded',handleNegotiation);
      return ()=>{
        peer.removeEventListener('negotiationneeded',handleNegotiation);
      }
    },[]);

    useEffect(()=>{
       getUserMediaStream();
    },[getUserMediaStream])

  return (
    <>
    <h4>Room Page</h4>
    <h2>You are connected to {remoteEmailId}</h2>
    <button onClick={e=>sendStream(myStream)}>Send My Video</button>
    <ReactPlayer url={myStream} playing muted/>
    <ReactPlayer url={remoteStream} playing/>
    </>
  )
}

export default RoomPage;