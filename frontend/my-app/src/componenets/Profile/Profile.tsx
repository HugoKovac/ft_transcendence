import LoginStateContext from "./../Login/LoginStateContext"
import SelfProfile from "./SelfProfile"
import GamePartProfile from "./GamePartProfile"
import {useContext, useState, useEffect} from 'react'
import { useSearchParams } from "react-router-dom"
import "./profile_style.scss"
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import ButtonRelativeState from "../relatives/ButtonRelativeState"
import { NavLink } from "react-router-dom"


const ButtonsRelative = (props : {name : string, img_path: string, id : number} ) => {
    const {logState} = useContext(LoginStateContext)
	const [relative_req, setRelativeReqState] = useState<string>("")
	const [relative_state, setRelativeState] = useState<string>("")
	let copySetRelativeReqState = (rs : string) => {
		setRelativeReqState(rs)
	}

	useEffect(() => {
		const req_base = axios.create({ baseURL: 'http://localhost:3000/api/req-friend/', withCredentials: true})
		const obj_req = {user_id: logState, send_id : props.id}
		let strPost : string = ""
		if (relative_req === "remove_friend")
			strPost = 'delete'
		else if (relative_req === "add_friend")
				strPost = "sendInvit"
		else if (relative_req === "block_user")
			strPost = "blockUser"
		else if (relative_req === "unblock_user")
				strPost = "unblockUser"
		else if (relative_req === "send")
				strPost = "sendInvit"
		else
		{
			req_base.post('relative-state', obj_req).then((res) => {
				if (!res.data)
					return
				setRelativeState(res.data)
				console.log("resp 2 ; ", res.data)
			}).catch((e) => {console.log(e)})
				return
		}
		console.log("req : ", strPost)
		req_base.post(strPost, obj_req).then((res) => {
			console.log("response : ", res.data)
			toast.info(res.data, {
				position: toast.POSITION.BOTTOM_RIGHT
			  });
			req_base.post('relative-state', obj_req).then((res) => {
			if (!res.data)
				return
			setRelativeState(res.data)
			console.log("resp 2 ; ", res.data)
		}).catch((e) => {console.log(e)})
	})
	}, [relative_req, logState, props.id])

	if (relative_state === "")
		return <></>
	else
    	return <ButtonRelativeState relative_state={relative_state} setRelativeReqState={copySetRelativeReqState}/>
}


export type userProto = {
		id :number,
		email: string,
		username: string,
		pp: string,
		provider_id : number,
		status : number,
		LobbyID: string
		}

export function statusDetermine(status : number, lobby : string) : JSX.Element
{
	let query : string = "/game/matchmaking?id=" + lobby
	if (status === 2)
		return <div className="status">
			<NavLink to={query}>
				<p>Status : inGame</p>
			</NavLink>
		</div>
	else if (status === 1)
		return <div className="status"><p>Status : Online</p></div>
	else
		return <div className="status"><p>Status : Offline</p></div>
}

export const ProfileComp = () => {

	const [queryEntries] = useSearchParams()
	const [dataUser, setDataUser] = useState<userProto | 'loading' | undefined>("loading")
	const {logState} = useContext(LoginStateContext)
	let user_id : string  = queryEntries.get('userId') ?? logState.toString()
	const res_user_id : number = !Number.isNaN(user_id) && !Number.isNaN(Number.parseInt(user_id)) ? Number.parseInt(user_id) : -1
	console.log("Query : => ", res_user_id)
	
	async function get_data_user (res_user_id : number) : Promise<void> 
	{
		if (res_user_id === -1 || (dataUser !== undefined && dataUser !== 'loading'))
			return
		const req_base = axios.create({ baseURL: 'http://localhost:3000/api/profile/', withCredentials: true})
		req_base.post("getUserData", {user_id : logState, target_id : res_user_id}).then((res) => {
			console.log(JSON.stringify(res.data, null, 2), "  <----")
			let buffProto : userProto | undefined = res.data
			if (buffProto?.pp && buffProto.pp.startsWith('localhost:3000/profile-pictures/'))
				buffProto.pp = 'http://' + buffProto.pp
			if (buffProto?.id)
				setDataUser(buffProto)
			else
				setDataUser(undefined)
		}).catch((e) => console.log(e))
	}
	function copySetDataUser(rs : 'loading' | undefined) : void
	{
		setDataUser(rs)
	}

	if (res_user_id !== -1)
		get_data_user(res_user_id)

	if (dataUser === undefined || res_user_id === -1)
		return <div className="not_found"><p>404 : not found</p></div>
	
	else if (logState === res_user_id && dataUser !== undefined &&  dataUser !== 'loading')
	{
		let newData : userProto = dataUser
		return <SelfProfile userData={newData} setData={copySetDataUser}/>
	}
	else if (dataUser === 'loading')
	return <div className="load"><p>Loading</p></div>

	else if (dataUser !== undefined) {
	let path : JSX.Element = <img className="ppUser" alt="pp" src={ dataUser?.pp ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0D8RJLIfGu9BfAEv3oMYyxiGfkGsGABeSsY6K2Ugy&s"}/>
	return <div className="profilePage">
		<div className="profileHeader">
			<ToastContainer/>
			<div className="pp">
				{path}
			</div>
			<div className="nameUser">
				<p className="name">{dataUser?.username}</p>
			</div>
			<ButtonsRelative name={dataUser?.username} img_path={dataUser.pp} id={dataUser.id}/>
			<div className="status">
				{statusDetermine(dataUser.status, dataUser.LobbyID)}
			</div>
		</div>
		<GamePartProfile user_id={Number(user_id)}/>
	</div>
	}
}
