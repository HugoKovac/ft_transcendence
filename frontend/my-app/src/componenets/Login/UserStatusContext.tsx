import { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client"
import LoginStateContext from "../Login/LoginStateContext";

const socket = io();
export const UserStatusContext = createContext<Socket>(socket);

export const UserStatusProvider = ({children}:any) => {

	const {logState} = useContext(LoginStateContext);
    const socket = io('http://localhost:3000/status', {query: { userID : logState }});

	return (
		<UserStatusContext.Provider value={socket}>
			{children}
		</UserStatusContext.Provider>
	)
}