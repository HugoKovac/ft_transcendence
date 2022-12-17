import { NavLink } from "react-router-dom"
import Disconnect from "../componenets/Disconnect"
import NavBar from "../componenets/NavBar"


const Profile = () => {
	return (
		<div>
			<NavBar />
			<h1>Profile Page</h1>
			<Disconnect />
			<NavLink to='/active2FA'>Active 2FA</NavLink>
		</div>
	)
}

export default Profile