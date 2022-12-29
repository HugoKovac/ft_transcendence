import React, { useContext } from "react"
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Game from "../pages/Game"
import Chat from "../pages/Chat"
import Friends from "../pages/Friends"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Profile from "../pages/Profile_bis"
import Unauthorized from "../pages/Unauthorized"
import CheckTokenAfterLogin, { CheckTokenFirstMount } from "./Login/CheckToken"
import LoginStateContext from "./Login/LoginStateContext"
import GameMatchmaking from "./Game/Matchmaking/GameMatchmaking"
import GamePrivateManager from "./Game/Private/GamePrivateManager"
import Verify2fa from "./Login/VerifyTwoFA"
import Active2FA from "../pages/ActiveTwoFA"
import { WebsocketProvider } from "./Game/WebsocketContext"
import { InviteProvider } from "./Chat/InviteSocket"




const ProtectedRoute = () : React.ReactElement => {
	
	const { logState } = useContext(LoginStateContext)

	return (
			<div>
				{logState ? <Outlet /> : <Unauthorized />}
			</div> 
		)
}

const RoutesBrowser = () : React.ReactElement => {
	CheckTokenFirstMount()
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/profile" element={<ProtectedRoute />}>
					<Route path="/profile" element={<Profile />} />
				</Route>
				<Route path='/chat' element={<ProtectedRoute />}>
					<Route path='/chat' element={ <InviteProvider> <Chat /> </InviteProvider>}/>
				</Route>
				<Route path='/friends' element={<ProtectedRoute />}>
					<Route path='/friends' element={<Friends />}/>
				</Route>
				<Route path='/game' element={<ProtectedRoute />}>
					<Route path='/game' element={<Game />}/>
				</Route>
					<Route path='/game/matchmaking' element={<ProtectedRoute />}>
						<Route path='/game/matchmaking' element={ <WebsocketProvider> <GameMatchmaking /> </WebsocketProvider>}/>
					</Route>
					<Route path='/game/lobby' element={<ProtectedRoute />}>
						<Route path='/game/lobby' element={ <WebsocketProvider> <GamePrivateManager/> </WebsocketProvider>}/>
					</Route>
				<Route path='/redirect/check_token' element={<CheckTokenAfterLogin />} />
				<Route path='/redirect/verify_2fa' element={<Verify2fa />} />
				<Route path='/active2FA' element={<Active2FA />} />
			</Routes>
		</BrowserRouter>
		)	
}

export default RoutesBrowser