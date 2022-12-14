import axios from "axios"
import { useContext, useEffect, useState } from "react"
import LoginStateContext from "../Login/LoginStateContext"


const ChooseFriend = (props: {setPopup: (set: boolean) => void, convList: JSX.Element[]}) => {

	const [list, setList] = useState([{
		id: 0,
		friend_id: 0,
		friend_username: '',
		created: new Date()
	}])

	const convListCpy = props.convList

	useEffect(() => {
		async function get() {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/friends/',
				withCredentials: true
			})
			try{
				await axInst.get('list').then((res) => {
					let cpy = res.data
	
					try{
						for (let i of convListCpy){
							for (let j in cpy){
								if (i.props.name === cpy[j].friend_username){
										delete cpy[j]
									}
								}
						}
					}
					catch(e){
						console.error(e)
					}
	
					setList(cpy)
				})
			}
			catch{
				console.error('Error with fetch of http://localhost:3000/api/friends/list')
			}
		}
		get()
	}, [convListCpy])

	const {logState} = useContext(LoginStateContext)

	const ClickOnFriend = async (friend_id: number) => {
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/message/',
			withCredentials: true
		})
		try{
			await axInst.post('new_conv', {user_id_1: logState, user_id_2: friend_id}).then((res) => (res.data))
			props.setPopup(false)
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