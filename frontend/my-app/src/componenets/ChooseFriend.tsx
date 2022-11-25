import axios from "axios"
import { useEffect, useState } from "react"


const ChooseFriend = () => {

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

	return <div>
		<ul>
			{list.map((i) => <div className="friendBox"><li key={i.friend_id}>{i.friend_username}</li></div>)}
		</ul>
	</div>
}

export default ChooseFriend