import React, { useContext } from "react"
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Chat from "../pages/Chat"
import Friends from "../pages/Friends"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Profile from "../pages/Profile"
import Unauthorized from "../pages/Unauthorized"
import CheckTokenAfterLogin, { CheckTokenFirstMount } from "./CheckToken"
import LoginStateContext from "./LoginStateContext"



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
				{/* <Route path='/chat' element={<ProtectedRoute />}> */}
					<Route path='/chat' element={<Chat />}/>
				{/* </Route> */}
				<Route path='/friends' element={<ProtectedRoute />}>
					<Route path='/friends' element={<Friends />}/>
				</Route>
				<Route path='/redirect/check_token' element={<CheckTokenAfterLogin />} />
			</Routes>
		</BrowserRouter>
		)	
}

export default RoutesBrowser