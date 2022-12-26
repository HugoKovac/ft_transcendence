import { NavLink } from "react-router-dom"
import Disconnect from "../componenets/Disconnect"
import NavBar from "../componenets/NavBar"
import { useEffect, useState } from "react"
import axios from "axios"


/*const Profile = () => {
	const [activeButton, setActiveButton] = useState(false)
	useEffect(() => {
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/auth',
			withCredentials: true,
		})

		axInst.get('is_active').then((res) => {
			console.log(res.data)
			if (res.data === false)
				setActiveButton(true)
		}).catch((e) => {
			console.error((e));
		})
	})

	const button = activeButton ? <NavLink to='/active2FA'>Active 2FA</NavLink> : <></>
	return (
		<div>
			<NavBar />
			<h1>Profile Page</h1>
			<Disconnect />
			{button}
		</div>
	)
}

export default Profile*/