import axios from "axios"
import { useContext, useEffect, useState } from "react"
import LoginStateContext from "./LoginStateContext"

const FriendsList = () => {
	const {rerender, setRerender, logState} = useContext(LoginStateContext)
	const [refresh, setRefresh] = useState(false)

	const delHandle = async (friend_id: number) => {
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/friends/',
			withCredentials: true
		})
	
		alert(await axInst.post('delete', {user_id: logState, del_id: friend_id}).then((res) => (res.data)))
		setRefresh(true)
	}

	const [friendList, setFriendList] = useState([{
		id: 0,
		friend_id: 0,
		friend_username: '',
		created: new Date()
	}])

	const getList = async () => {
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/friends/',
			withCredentials: true
		})
	
		setFriendList(await axInst.get('list').then((res) => (res.data)))
	}
	
	const list = friendList.map((i) => <li key={i.id}>
			<span>{i.friend_username}</span>
			<button onClick={() => {delHandle(i.friend_id)}}>test</button>
		</li>)

	useEffect(() => {getList(); setRerender(false)}, [setFriendList, rerender, setRerender])

	useEffect(() => {getList(); setRefresh(false)}, [setRefresh, refresh])

	return <div>
		<ul>
			{list}
		</ul>
	</div>
}

export default FriendsList