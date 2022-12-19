import { useEffect, useState, useContext } from 'react'
import ButtonRelativeState from "./ButtonRelativeState"
import axios from "axios"
import LoginStateContext from "./../Login/LoginStateContext"
import "./relatives.scss"



const LineUser = (props : {name : string, img_path: string, id : number, default_state : string}) => {
	console.log(JSON.stringify(props, null, 2))
	const {logState} = useContext(LoginStateContext)
	let relative_state : string = props.default_state
	const [relative_req, setRelativeReqState] = useState<string>("")
	let copySetRelativeReqState = (rs : string) => {
		setRelativeReqState(rs)
	}
		
	const req_base = axios.create({ baseURL: 'http://localhost:3000/api/req-friend/', withCredentials: true})
	const obj_req = {user_id: logState, send_id : props.id}
	if (relative_req == "remove_friend")
		req_base.post('delete', obj_req).catch((e) => {console.log(e)})
	else if (relative_req == "add_friend")
		req_base.post('sendInvit', obj_req).catch((e) => {console.log(e)})
	else if (relative_req == "block_user")
		req_base.post('blockUser', obj_req).catch((e) => {console.log(e)})
	else if (relative_req == "unblock_user")
		req_base.post('unblockUser', obj_req).catch((e) => {console.log(e)})
	else if (relative_req == "send")
		req_base.post('sendInvit', obj_req).catch((e) => {console.log(e)})
	req_base.post('relative-state', obj_req).then((res) => {
		if (!res.data)
			return
		relative_state = res.data
		console.log(JSON.stringify(relative_state, null, 2))
	})

	const renderImg = props.img_path ? <img src={props.img_path} alt="pp" className='pp'/> : <></>
    //will redirect to the profile onclick
    return <li>
		<div onClick={() => {}} className="profileLine">
        {renderImg}
        <p>{props.name}</p>
        <ButtonRelativeState relative_state={relative_state} setRelativeReqState={copySetRelativeReqState}/>
        </div>
		</li>
}

export default LineUser