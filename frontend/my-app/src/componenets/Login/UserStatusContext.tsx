import { createContext, useContext } from "react";
import { io, Socket } from "socket.io-client"
import LoginStateContext from "../Login/LoginStateContext";

export const UserStatusContext = createContext<Socket | undefined>(undefined);

export const UserStatusProvider = ({children}:any) => {

	let socket = undefined;
	const {logState} = useContext(LoginStateContext);

	if (logState !== 0)
		socket = io('http://localhost:3000/status', {query: { userID : logState }});

	return (
		<UserStatusContext.Provider value={socket}>
			{children}
		</UserStatusContext.Provider>
	)
}