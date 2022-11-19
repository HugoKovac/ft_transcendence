import { NavLink } from "react-router-dom"
import "../styles/NavBar.css"
import { useContext } from "react"
import LoginStateContext from "./LoginStateContext"


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

function FriendsButton(){
	return ( <Button path='/friends' content='Friends'/> )
}

function LeftBar(){
	const {logState} = useContext(LoginStateContext)
	let button
	
	if (logState !== 0)
	button = <ChatButton />

	return (
		<ul className="left-NavBar">
			 <Button path='/' content='Home'/>
			{button}
		</ul>
	)
}

function RightBar(){
	const {logState} = useContext(LoginStateContext)
	let button

	if (logState !== 0)
		button = <div>
			<FriendsButton />
			<ProfileButton />
		</div>
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