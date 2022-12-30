import { useEffect, useState } from "react";
import LineUser from "./LineUser";
import axios from "axios"

const ListRelative  = (props : {}) => {
	type userProto = {
		id :number,
		email: string,
		username: string,
		pp: string,
		provider_id : number,
		LobbyID : string,
		status: number
		}
		let [listUserFriends, setListUserFriends] = useState<JSX.Element[]>([])
		let [listUserInvit, setListUserInvit] = useState<JSX.Element[]>([])
		let [listUserBlock, setListUserBlock] = useState<JSX.Element[]>([])

		function setFriends (newElem : JSX.Element[]) : void {setListUserFriends(newElem)}
		function setInvit (newElem : JSX.Element[]) : void {setListUserInvit(newElem)}
		function setBlock (newElem : JSX.Element[]) : void {setListUserBlock(newElem)}

		function setUpList(req : string, setter : (newE : JSX.Element[]) => void, defaultState : string) : void
		{
		const req_base = axios.create({ baseURL: 'http://localhost:3000/api/req-friend/', withCredentials: true})
		req_base.post(req).then((res) => {
			// console.log("list of friends : ", JSON.stringify(res.data, null, 2))
			if (!res.data)
				return ;
			let listUserFriends : userProto[] = res.data
			setter(listUserFriends.map((ele) => {
			let pp : string = ele.pp
			if (pp && pp.startsWith('localhost:3000/profile-pictures/'))
				pp = 'http://' + pp;
			return <LineUser name={ele.username} img_path={pp} id={ele.id} default_state={defaultState} status={ele.status} lobbyID={ele.LobbyID}/>
			}))
			// console.log("list of friends modified : ", JSON.stringify(listUserFriends, null, 2))
		}).catch()

		}
		useEffect(() => {
			setUpList('list-friends-as-users', setFriends, "friend")
			setUpList("list-invit", setInvit, "recv")
			setUpList("list-blocked", setBlock, "blocked")
		}, [])

	// console.log("first_response : ", JSON.stringify(listUserFriends, null, 2))
	return <div className="ListRelative">
		<div className="titleListRelative">
			<p>Friends</p>
		</div>
	<ul>{listUserFriends}</ul>
	<div className="titleListRelative">
			<p>Invitations</p>
		</div>
	<ul>{listUserInvit}</ul>
	<div className="titleListRelative">
			<p>Block List</p>
		</div>
	<ul>{listUserBlock}</ul>
	</div>
}
export default ListRelative