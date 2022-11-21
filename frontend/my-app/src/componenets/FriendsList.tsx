import axios from "axios"
import { useEffect, useState } from "react"

type Friend = {
	id: 0,
	friend_id: 0,
	friend_username: string,
	created: Date
}

const FriendsList = () => {
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
	useEffect(() => {getList()}, [FriendsList, setFriendList])
	return <div>
		<ul>
			{list}
		</ul>
	</div>
}

export default FriendsList