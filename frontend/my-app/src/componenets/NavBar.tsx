import { NavLink } from "react-router-dom"
import "../styles/NavBar.css"
import axios from 'axios'
import { useEffect, useState } from "react"

type props_right_bar = { logged_in: boolean }

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

function LeftBar(){
	return (
		<ul className="left-NavBar">
			 <NavLink to='/' className={(nav) : any => (nav.isActive ? "ancr nav-active" : "ancr")}>
				<li>Home</li>
			</NavLink>
		</ul>
	)
}

function RightBar(){

	const [log, setLog] = useState(false)

	let button;

	const axInst = axios.create({
		baseURL: 'http://localhost:3000/api/',
		withCredentials: true,
	})

	useEffect(
		() => {axInst.get('auth/logged').then((res) => {setLog(res.data)})}, []
	)


	if (log === true)
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