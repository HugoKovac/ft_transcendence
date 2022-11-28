import axios from "axios"
import { useContext, useEffect, useState } from "react"
import LoginStateContext from "./LoginStateContext"


const ChooseFriend = (props: {setPopup: (set: boolean) => void}) => {

	const [list, setList] = useState([{
		id: 0,
		friend_id: 0,
		friend_username: '',
		created: new Date()
	}])


	async function get() {
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/friends/',
			withCredentials: true
		})
		try{
			console.log('fetch')
			setList(await axInst.get('list').then((res) => (res.data)))
		}
		catch{
			console.error('Error with fetch of http://localhost:3000/api/friends/list')
		}
	}

	useEffect(() => {get()}, [])

	const {logState} = useContext(LoginStateContext)

	const ClickOnFriend = async (friend_id: number) => {
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/message/',
			withCredentials: true
		})
		try{
			console.log(await axInst.post('new_conv', {user_id_1: logState, user_id_2: friend_id}).then((res) => (res.data)))
			props.setPopup(false)
			//close popup 
			//redirect to conv
		}
		catch{
			console.error('Error with fetch of http://localhost:3000/api/message/new_conv')
		}
	}

	return <div>
			{list.map((i) => <div key={i.friend_id} onClick={() => {ClickOnFriend(i.friend_id)}} className="friendBox">{i.friend_username}</div>)}
		</div>
}

export default ChooseFriend