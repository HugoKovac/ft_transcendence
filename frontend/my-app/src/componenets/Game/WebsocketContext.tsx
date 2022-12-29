import { useState } from "react";
import { createContext, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client"
import LoginStateContext from "../Login/LoginStateContext";

export const WebsocketContext = createContext<Socket | undefined >(undefined);

export const WebsocketProvider = ({children}:any) => {

	let socket = undefined;
	const {logState} = useContext(LoginStateContext);

	if (logState !== 0)
		socket = io('http://localhost:3000/game', {query: { userID : logState }});

	console.log(logState)
	return (
		<WebsocketContext.Provider value={socket}>
			{children}
		</WebsocketContext.Provider>
	)
}