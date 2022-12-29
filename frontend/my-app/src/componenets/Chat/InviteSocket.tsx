import { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client"
import LoginStateContext from "../Login/LoginStateContext";

export const InviteContext = createContext<Socket | undefined >(undefined);

export const InviteProvider = ({children}:any) => {

	let socket = undefined;
	const {logState} = useContext(LoginStateContext);

	if (logState !== 0)
		socket = io('http://localhost:3000/game', {query: { userID : logState }});

	console.log(logState)
	return (
		<InviteContext.Provider value={socket}>
			{children}
		</InviteContext.Provider>
	)
}