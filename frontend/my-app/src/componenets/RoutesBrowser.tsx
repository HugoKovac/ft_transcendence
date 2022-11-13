import React, { useContext } from "react"
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Chat from "../pages/Chat"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Profile from "../pages/Profile"
import Unauthorized from "../pages/Unauthorized"
import CheckToken from "./CheckToken"
import LoginStateContext, { LoginStateProvider } from "./LoginStateContext"



const ProtectedRoute = () : React.ReactElement => {
	
	const { logState } = useContext(LoginStateContext)
	return (
			<div>
				{/* <h1>{JSON.stringify(logState)}</h1> */}
				{logState ? <Outlet /> : <Unauthorized />}
			</div> 
		)
}

const RoutesBrowser = () : React.ReactElement => {
	return (
		<LoginStateProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/profile" element={<Profile />} />
					<Route path='/chat' element={<ProtectedRoute />}>
						<Route path='/chat' element={<Chat />}/>{/*Dans chaque protected route check la validier du token au 1er render*/}
					</Route>
					<Route path='/redirect/check_token' element={<CheckToken />} />
				</Routes>
			</BrowserRouter>
		</LoginStateProvider>
		)	
}

export default RoutesBrowser