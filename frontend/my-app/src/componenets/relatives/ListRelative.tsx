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
		provider_id : number
		}
		let [listUser, setListUser] = useState<JSX.Element[]>([])
		useEffect(() => {
		const req_base = axios.create({ baseURL: 'http://localhost:3000/api/req-friend/', withCredentials: true})
		req_base.post('list-friends-as-users').then((res) => {
			console.log("list of friends : ", JSON.stringify(res.data, null, 2))
			if (!res.data)
				return ;
			let listUser : userProto[] = res.data
			setListUser(listUser.map((ele) => <LineUser name={ele.username} img_path={ele.pp} id={ele.id} default_state="friend"/>))
			console.log("list of friends modified : ", JSON.stringify(listUser, null, 2))
		}).catch()
		}, [])

	console.log("first_response : ", JSON.stringify(listUser, null, 2))
	return <div className="ListRelative">
		<div className="titleListRelative">
			<p>Friends</p>
		</div>
	<ul>{listUser}</ul>
	</div>
}
export default ListRelative