import { useEffect, useState, useContext } from 'react'
import ButtonRelativeState from "./ButtonRelativeState"
import axios from "axios"
import LoginStateContext from "./../Login/LoginStateContext"
import "./relatives.scss"
import { ToastContainer, toast } from 'react-toastify';
import { statusDetermine } from '../Profile/Profile'
import Parsepp from '../imgParse'



const LineUser = (props : {name : string, img_path: string, id : number, default_state : string, status: number, lobbyID: string}) => {
	console.log(JSON.stringify(props, null, 2))
	const {logState} = useContext(LoginStateContext)
	const [relative_req, setRelativeReqState] = useState<string>("")
	const [relative_state, setRelativeState] = useState<string>(props.default_state)
	let copySetRelativeReqState = (rs : string) => {
		setRelativeReqState(rs)
	}
	
	async function get() : Promise<void> {
		const req_base = axios.create({ baseURL: 'http://localhost:3000/api/req-friend/', withCredentials: true})
		const obj_req = {user_id: logState, send_id : props.id}
		let strPost : string = ""
		if (relative_req == "remove_friend")
			strPost = 'delete'
		else if (relative_req == "add_friend")
				strPost = "sendInvit"
		else if (relative_req == "block_user")
			strPost = "blockUser"
		else if (relative_req == "unblock_user")
				strPost = "unblockUser"
		else if (relative_req == "send")
				strPost = "sendInvit"
		else
		{
			console.log("No req were sent")
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
	}
	useEffect(() => {get()}, [])
	useEffect(() => {get()}, [relative_req])

	const renderImg = props.img_path ? <img src={Parsepp(props.img_path)} alt="pp" className='pp'/> : <></>
    //will redirect to the profile onclick
	console.log("relativeState : ", relative_state)
    return <li>
		<div className="profileLine">
		<ToastContainer/>
		<a href={"/profile?userId?" + logState}>
        	{renderImg}
		</a>
        <p>{props.name}</p>
        <ButtonRelativeState relative_state={relative_state} setRelativeReqState={copySetRelativeReqState}/>
		{statusDetermine(props.status, props.lobbyID)}
		</div>
		</li>
}

export default LineUser