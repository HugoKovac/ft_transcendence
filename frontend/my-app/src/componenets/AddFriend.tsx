import axios from "axios"
import { useContext, useState } from "react"
import LoginStateContext from "./LoginStateContext"

const AddFriend = () => {
	const [username, setUsername] = useState('')
	const {logState} = useContext(LoginStateContext)
	const payload = {
		id: logState,
		add: username,
	}
	const axInst = axios.create({
		baseURL: 'http://localhost:3000/api/',
		withCredentials: true,
	})

	const HandleNewFriend = async (e: any) => {
		e.preventDefault()
		try{
			await axInst.post('friends/add', payload).then((res) => {console.log(res.data)})
		}catch(e){
			console.error(e)
			console.error('axios error (friends/add)')
		}
	}

	return <form onSubmit={HandleNewFriend}>
			<input type="text" name="new_friend" onChange={(e) => (setUsername(e.target.value))} />
			<button>add</button>
	</form>
}

export default AddFriend