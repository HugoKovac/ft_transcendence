import axios from "axios"
import { useContext, useEffect, useState } from "react"
import LoginStateContext from "./LoginStateContext"

// type Message = {
// 	msg_id: number,
// 	send_id: number,
// 	recv_id: number,
// 	message: string,
// 	send_at: Date,
// }

const Conv = ({user_id, friend_id}: {user_id: number, friend_id: number}) => {
	const {rerender, setRerender} = useContext(LoginStateContext)
	
	const [conv, setConv] = useState([{
		msg_id: 0,
		send_id: 0,
		recv_id: 0,
		message: '',
		send_at: new Date(),
	}])
	
	
	
	useEffect(() => {
		const getConv = async () => {
			try{
				
				const axInst = axios.create({
					baseURL: 'http://localhost:3000/api/message/',
					withCredentials: true
				})
				
				const payload: {user_id: number,friend_id: number} = {
					user_id: user_id,
					friend_id: friend_id
				}
				
				setConv(await axInst.post('conv', payload).then(res => {console.log(res.data);return res.data}))
			}
			catch(e){
				console.error(e)
			}
		}
		if (rerender === true)
			getConv()
		setRerender(false)
	},[friend_id, user_id, setRerender, rerender])//rerender quand send new message
	
	const format = conv.map((i) => <span key={i.msg_id}>{i.message}{'\n'}</span>)

	return <div>
		{format}
	</div>
}

export default Conv