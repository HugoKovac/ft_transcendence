import { NavLink } from "react-router-dom"
import "../styles/NavBar.css"
import { useContext, useEffect } from "react"
import LoginStateContext, { CheckLogState } from "./LoginStateContext"


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

// CheckLogState(logState)

function LeftBar(){
	const {logState, setLogState} = useContext(LoginStateContext)
	useEffect(
		() => {
			const fetchLogState = () => {
				try{
					CheckLogState(logState, setLogState)
				}catch(e){
					console.log(e)
				}
			}
			fetchLogState()
		}
	, [logState])
	let button
	
	if (logState === true)
		button = <ChatButton />

	return (
		<ul className="left-NavBar">
			 <Button path='/' content='Home'/>
			{button}
		</ul>
	)
}

function RightBar(){
	const {logState, setLogState} = useContext(LoginStateContext)

	useEffect(
		() => {
			const fetchLogState = () => {
				try{
					CheckLogState(logState, setLogState)
				}catch(e){
					console.log(e)
				}
			}
			fetchLogState()
		}
	, [logState])
	let button

	if (logState === true)
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