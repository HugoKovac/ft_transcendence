import { NavLink } from "react-router-dom"
import "../styles/NavBar.css"

type props_right_bar = { logged_in: boolean }

function Login_button(){
	return (
		<NavLink to='/login' className={(nav) : any => (nav.isActive ? "ancr nav-active" : "ancr")}>
				<li>Login</li>
		</NavLink>
	)
}

function Profile_button(){
	return (
		<NavLink to='/profile' className={(nav) : any => (nav.isActive ? "ancr nav-active" : "ancr")}>
				<li>Profile</li>
		</NavLink>
	)
}

function Left_bar(){
	return (
		<ul className="left-NavBar">
			 <NavLink to='/' className={(nav) : any => (nav.isActive ? "ancr nav-active" : "ancr")}>
				<li>Home</li>
			</NavLink>
		</ul>
	)
}

function Right_bar(props : props_right_bar){

	let button;

	if (props.logged_in)
		button = <Profile_button />
	else
		button = <Login_button />

	return (
		<ul className="right-NavBar">
			{button}
		</ul>
	)
}

const NavBar = () => {
	return (
		<div className="NavBar">
			<Left_bar />
			<Right_bar logged_in={false} />
		</div> 
	)
}

export default NavBar