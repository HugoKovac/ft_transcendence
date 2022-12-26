import LoginStateContext from "./../Login/LoginStateContext"
import SelfProfile from "./SelfProfile"
import GamePartProfile from "./GamePartProfile"
import {useContext, useState, useEffect} from 'react'
import { useSearchParams } from "react-router-dom"
import "./profile_style.scss"
import axios from "axios"

export type userProto = {
		id :number,
		email: string,
		username: string,
		pp: string,
		provider_id : number,
		status : string
		}

export const ProfileComp = () => {

	const [queryEntries, setQueryEntries] = useSearchParams()
	const [dataUser, setDataUser] = useState<userProto | 'loading' | undefined>("loading")
	const {logState} = useContext(LoginStateContext)
	let user_id : string  = queryEntries.get('userId') ?? logState.toString()
	const res_user_id : number = !Number.isNaN(user_id) && !Number.isNaN(Number.parseInt(user_id)) ? Number.parseInt(user_id) : -1
	console.log("Query : => ", res_user_id)
	
	async function get_data_user (res_user_id : number) : Promise<void> 
	{
		if (res_user_id == -1 || (dataUser != undefined && dataUser != 'loading'))
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
	if (res_user_id != -1)
		get_data_user(res_user_id)

	if (dataUser == undefined || res_user_id === -1)
		return <div className="not_found"><p>404 : not found</p></div>
	
	else if (logState == res_user_id && dataUser != undefined &&  dataUser != 'loading')
	{
		let newData : userProto = dataUser
		return <SelfProfile userData={newData} setData={copySetDataUser}/>
	}
	else if (dataUser == 'loading')
	return <div className="load"><p>Loading</p></div>

	else {
	let path : JSX.Element = <img className="ppUser" src={ dataUser?.pp ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0D8RJLIfGu9BfAEv3oMYyxiGfkGsGABeSsY6K2Ugy&s"}/>
	return <div className="profilePage">
		<div className="profileHeader">
			<div className="pp">
				{path}
			</div>
			<div className="nameUser">
				<p className="name">{dataUser?.username}</p>
			</div>
			<div className="status">
				<p className="status">{dataUser?.status}</p>
			</div>
		</div>
		<GamePartProfile user_id={Number(user_id)}/>
	</div>
	}
}
