import React, { useContext } from "react"
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Game from "../pages/Game"
import Chat from "../pages/Chat"
import Friends from "../pages/Friends"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Profile from "../pages/Profile"
import Unauthorized from "../pages/Unauthorized"
import CheckTokenAfterLogin, { CheckTokenFirstMount } from "./CheckToken"
import LoginStateContext from "./LoginStateContext"
import GameLobby from "./Game/GameLobby"
import GameMatchmaking from "./Game/GameMatchmaking"
import GamePrivateManager from "./Game/GamePrivateManager"




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
					<Route path='/chat' element={<Chat />}/>
				</Route>
				<Route path='/friends' element={<ProtectedRoute />}>
					<Route path='/friends' element={<Friends />}/>
				</Route>
				<Route path='/game' element={<ProtectedRoute />}>
					<Route path='/game' element={<Game />}/>
				</Route>
				<Route path='/game/matchmaking' element={<ProtectedRoute />}>
					<Route path='/game/matchmaking' element={<GameMatchmaking />}/>
				</Route>
				<Route path='/game/lobby' element={<ProtectedRoute />}>
					<Route path='/game/lobby' element={<GamePrivateManager />}/>
				</Route>
				<Route path='/redirect/check_token' element={<CheckTokenAfterLogin />} />
			</Routes>
		</BrowserRouter>
		)	
}

export default RoutesBrowser