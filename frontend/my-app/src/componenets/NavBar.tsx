import { NavLink } from "react-router-dom"
import "../styles/NavBar.css"
import axios from 'axios'
import { useEffect, useState } from "react"

export function IsLog(){
	const [log, setLog] = useState(false)


	const axInst = axios.create({
		baseURL: 'http://localhost:3000/api/',
		withCredentials: true,
	})

	useEffect(
		() => {axInst.get('auth/logged').then((res) => {setLog(res.data)})}, []
	)

	return log
}

function LoginButton(){
	return (
		<NavLink to='/login' className={(nav) : any => (nav.isActive ? "ancr nav-active" : "ancr")}>
				<li>Login</li>
		</NavLink>
	)
}

function ProfileButton(){
	return (
		<NavLink to='/profile' className={(nav) : any => (nav.isActive ? "ancr nav-active" : "ancr")}>
				<li>Profile</li>
		</NavLink>
	)
}

function ChatButton(){
	return (
		<NavLink to='/chat' className={(nav) : any => (nav.isActive ? "ancr nav-active" : "ancr")}>
				<li>Chat</li>
		</NavLink>
	)
}

function LeftBar(){
	let button
	
	if (IsLog() === true)
		button = <ChatButton />

	return (
		<ul className="left-NavBar">
			 <NavLink to='/' className={(nav) : any => (nav.isActive ? "ancr nav-active" : "ancr")}>
				<li>Home</li>
				{button}
			</NavLink>
			
		</ul>
	)
}

function RightBar(){

	let button

	if (IsLog() === true)
		button = <ProfileButton />
	else
		button = <LoginButton />

	return (
		<ul className="right-NavBar">
			{button}
		</ul>
	)
}

const NavBar = () => {
	return (
		<div className="NavBar">
			<LeftBar />
			<RightBar />
		</div> 
	)
}

export default NavBar