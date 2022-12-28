import { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client"
import LoginStateContext from "../Login/LoginStateContext";

const socket = io();
export const WebsocketContext = createContext<Socket>(socket);

export const WebsocketProvider = ({children}:any) => {

	const {logState} = useContext(LoginStateContext);
    const socket = io('http://localhost:3000/game', {query: { userID : logState }});

	return (
		<WebsocketContext.Provider value={socket}>
			{children}
		</WebsocketContext.Provider>
	)
}