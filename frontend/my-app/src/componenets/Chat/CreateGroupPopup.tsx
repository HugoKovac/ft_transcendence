import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import './CreateGroupPopup.scss'
import LoginStateContext from '../Login/LoginStateContext'

type Friend = {
	id:number,
	friend_id: number,
	friend_username: string
}

const CreateGroupPopup = () => {
	const [groupName, setGroupName] = useState('')
	const [friendList, setFriendList] = useState([<label></label>])
	const [checkboxState, setCheckboxState] = useState([false])
	const {logState} = useContext(LoginStateContext)
	
	
	useEffect(() => {
		const handleCheckedBox = (e:any) => {
			let tmp = checkboxState
			tmp[e.target.value] = tmp[e.target.value] ? !tmp[e.target.value] : true
			setCheckboxState(tmp)
		}

		async function get() {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/friends/',
				withCredentials: true
			})
			try{
				await axInst.get('list').then((res) => {
					console.log(res.data)
					let list = res.data
					setFriendList(list.map((i: Friend) => <label key={i.friend_id}><input onChange={handleCheckedBox} value={i.friend_id} type="checkbox" /> {i.friend_username}</label>))
				})
			}
			catch{
				console.error('Error with fetch of http://localhost:3000/api/friends/list')
			}
		}
		get()
	}, [setFriendList, checkboxState])

	const groupSubmit = async () => {
		let addList:number[] = []

		for (let i in checkboxState)
			if (checkboxState[i] === true)
				addList.push(parseInt(i))

		addList.push(logState)

		const payload = {
			user_ids: addList,
			group_name: groupName
		}

		console.log(payload)

		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/message/',
			withCredentials: true
		})
		try{
			await axInst.post('new_group_conv', payload).then((res) => {
				console.log(res.data)
			})
		}
		catch{
			console.error('Error with fetch of http://localhost:3000/api/message/new_group_conv')
		}
	}

	return <div className='CreateGroupPopup'>
		<div className='groupName'>
			<label htmlFor='groupName'>Group Name :</label>
			<input id='groupName' name='groupName' type="text" placeholder="Group Name" maxLength={35} onChange={(e) => (setGroupName(e.target.value))} autoFocus />
		</div>
		<div className='friendList'>
			{friendList}
		</div>
		<button onClick={groupSubmit}>Create Group</button>
	</div>
}

export default CreateGroupPopup