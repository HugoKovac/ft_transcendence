import axios from "axios"
import { useContext, useEffect, useState } from "react"
import LoginStateContext from "./LoginStateContext"

type Friend = {
	id: 0,
	friend_id: 0,
	friend_username: string,
	created: Date
}

const FriendsList = () => {
	const {rerender, setRerender} = useContext(LoginStateContext)

	const [friendList, setFriendList] = useState([{
		id: 0,
		friend_id: 0,
		friend_username: '',
		created: new Date
	}])

	const getList = async () => {
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/friends/',
			withCredentials: true
		})
	
		setFriendList(await axInst.get('list').then((res) => (res.data)))
	}
	
	const list = friendList.map((i) => <li key={i.id}> {i.friend_username} </li>)
//refresh when add new friend in <AddFriend />
	useEffect(() => {getList(); setRerender(false)}, [FriendsList, setFriendList, rerender, setRerender])
	return <div>
		<ul>
			{list}
		</ul>
	</div>
}

export default FriendsList