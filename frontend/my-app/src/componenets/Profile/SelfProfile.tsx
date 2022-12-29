import LoginStateContext from "./../Login/LoginStateContext"
import { ChangeEvent, useContext, useState, useEffect} from 'react'
import { userProto } from "./Profile"
import GamePartProfile from "./GamePartProfile"
import axios from "axios"
import { NavLink } from "react-router-dom"
import Disconnect from "../Disconnect"
import { ToastContainer, toast } from 'react-toastify';


const SelfProfile = (props : {userData : userProto, setData : (rs : 'loading' | undefined) => void}) => {
	let userData: userProto = props.userData
	const [newUsername, setNewUsername] = useState<string>("")
	const [newPp, setNewPp] = useState<File>()
	const newPathSaMere : string = userData.pp
	let path : JSX.Element = <img className="ppUser" src={userData.pp ? newPathSaMere : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0D8RJLIfGu9BfAEv3oMYyxiGfkGsGABeSsY6K2Ugy&s"}/>
	const {logState} = useContext(LoginStateContext)
	//disconnect and a2f
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

	function setUsername () {
		if (newUsername == props.userData.username)
			return
		const req_base = axios.create({ baseURL: 'http://localhost:3000/api/profile/', withCredentials: true})
		req_base.post("setUsername", {user_id : logState, username : newUsername}).then((res) => {
			toast.info(res.data, {
				position: toast.POSITION.BOTTOM_RIGHT
			  });
			props.setData("loading")
		}).catch((e) => console.log(e))
	}
	function setPp () {
		if (newPp)
		{
			if (newPp.size > 10000)
			{
				toast.info("can't load : image too heavy", {
					position: toast.POSITION.BOTTOM_RIGHT
				  })
				  return ;
			}
			const req_base = axios.create({
				baseURL: 'http://localhost:3000/api/profile/',
				withCredentials: true
			})
			const formData = new FormData();
    		formData.append('file',newPp)
			
			req_base.post("uploadPp", formData, {headers : { "Content-Type": "multipart/form-data" }}).then((res) => {
				console.log(res)
				toast.info(res.data, {
					position: toast.POSITION.BOTTOM_RIGHT
				  });
				props.setData("loading")
			}).catch((e) => console.log(e))
		}
	}
	function delPp() {
			const req_base = axios.create({
				baseURL: 'http://localhost:3000/api/profile/',
				withCredentials: true,
			})
			req_base.post("delPp", {user_id : logState}).then((res) => {
				toast.info(res.data, {
					position: toast.POSITION.BOTTOM_RIGHT
				  });
				console.log(res)
				props.setData("loading")
			}).catch((e) => console.log(e))
		}

	return <div className="profilePage">
		<div className="profileHeader">
			<div className="disconnect">
				<Disconnect />
				{button}
			</div>
			<div className="pp">
			{path}
			<div className="buttonModif">
					<input type="file"
					      id="profile_pic"
						  name="profile_pic"
						  accept=".jpg, .jpeg, .png"
						  onChange={(e) => {
							if (e.target.files)
								setNewPp(e.target.files[0])
						  }
						  }/>
				<button onClick={setPp}>
					change profile picture
				</button>
				<button onClick={delPp}>
					delete profile picture
				</button>
			</div>
		</div>
		<div className="nameUser">
			<p className="name">{userData.username}</p>
			<div className="buttonModif">
				<input type="text" placeholder="Bob" onChange={(e) => setNewUsername(e.target.value)}/>
				<button onClick={setUsername}>
					change username
				</button>
			</div>
		</div>
		</div>
		<GamePartProfile user_id={Number(userData.id)}/>
		<ToastContainer/>

	</div>
	}

export default SelfProfile