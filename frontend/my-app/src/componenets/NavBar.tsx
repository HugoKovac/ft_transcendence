import { NavLink } from "react-router-dom"
import "../styles/NavBar.css"

const NavBar = () => {
	return (
		<div className="NavBar">
			<ul className="left-NavBar">
			 <NavLink to='/' className="ancr">
				<li>Home</li>
			</NavLink>
			</ul>
			<ul className="right-NavBar">
			<NavLink to='/login' className="ancr">
				{/*! if logged account */}
				<li>login</li>
			</NavLink>
			</ul>
		</div> 
	)
}

export default NavBar