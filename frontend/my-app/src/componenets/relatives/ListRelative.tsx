import { useEffect, useState , useContext } from "react";
import LineUser from "./LineUser";
import LoginStateContext from "./../Login/LoginStateContext"
import axios from "axios"

const ListRelative  = (props : {}) => {
	const {logState} = useContext(LoginStateContext)
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

		function setFriends (newElem : JSX.Element[]) : void {setListUserFriends(newElem)}
		function setInvit (newElem : JSX.Element[]) : void {setListUserInvit(newElem)}

		function setUpList(req : string, setter : (newE : JSX.Element[]) => void) : void
		{
		const req_base = axios.create({ baseURL: 'http://localhost:3000/api/req-friend/', withCredentials: true})
		req_base.post(req).then((res) => {
			console.log("list of friends : ", JSON.stringify(res.data, null, 2))
			if (!res.data)
				return ;
			let listUserFriends : userProto[] = res.data
			setter(listUserFriends.map((ele) => <LineUser name={ele.username} img_path={ele.pp} id={ele.id} default_state="friend" status={ele.status} lobbyID={ele.LobbyID}/>))
			console.log("list of friends modified : ", JSON.stringify(listUserFriends, null, 2))
		}).catch()

		}
		useEffect(() => {
			setUpList('list-friends-as-users', setFriends)
			setUpList("list-invit", setInvit)
		}, [])

	console.log("first_response : ", JSON.stringify(listUserFriends, null, 2))
	return <div className="ListRelative">
		<div className="titleListRelative">
			<p>Friends</p>
		</div>
	<ul>{listUserFriends}</ul>
	<div className="titleListRelative">
			<p>Invitations</p>
		</div>
	<ul>{listUserInvit}</ul>
	</div>
}
export default ListRelative