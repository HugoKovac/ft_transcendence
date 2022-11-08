import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Chat from "../pages/Chat"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Profile from "../pages/Profile"
import Unauthorized from "../pages/Unauthorized"
import { IsLog } from "./NavBar"

const ProtectedRoute = () : React.ReactElement => {
	const log = IsLog()

	return ( log ? <Outlet /> : <Unauthorized /> )
}

const RoutesBrowser = () : React.ReactElement => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/profile" element={<Profile />} />
				<Route path='/chat' element={<ProtectedRoute />}>
					<Route path='/chat' element={<Chat />}/>
				</Route>
			</Routes>
		</BrowserRouter>
		)	
}

export default RoutesBrowser