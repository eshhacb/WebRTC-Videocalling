import React, { useMemo } from 'react'
import {io} from "socket.io-client"

const SocketContext=React.createContext(null);

//custom hook(used to consume socketContext in a simplified way)
export const useSocket=()=>{
    return React.useContext(SocketContext);
}

export const SocketProvider=(props)=>{
    const socket=useMemo(()=>io('http://localhost:5001'),[])
    return(
        <SocketContext.Provider value={{socket}}>
            {props.children}
        </SocketContext.Provider>
    )
}