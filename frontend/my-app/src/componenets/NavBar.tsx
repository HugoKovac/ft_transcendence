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

function Button(props: any){
	return (
		<NavLink to={props.path} className={(nav) : any => (nav.isActive ? "ancr nav-active" : "ancr")}>
				<li>{props.content}</li>
		</NavLink>
	)
}

function LoginButton(){
	return ( <Button path='/login' content='Login'/> )
}

function ProfileButton(){
	return ( <Button path='/profile' content='Profile'/> )
}

function ChatButton(){
	return ( <Button path='/chat' content='Chat'/> )
}

function LeftBar(){
	let button
	
	if (IsLog() === true)
		button = <ChatButton />

	return (
		<ul className="left-NavBar">
			 <Button path='/' content='Home'/>
			{button}
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