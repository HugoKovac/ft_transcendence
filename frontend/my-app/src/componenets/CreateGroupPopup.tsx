import axios from 'axios'
import { useEffect, useState } from 'react'
import '../styles/CreateGroupPopup.scss'

//replace div by checkboxes
//On click check or uncheck the box
// {list.map((i) => <div key={i.friend_id} onClick={() => {ClickOnFriend(i.friend_id)}} className="friendBox">{i.friend_username}</div>)}

type Friend = {
	id:number,
	friend_id: number,
	friend_username: string
}

const CreateGroupPopup = () => {
	const [groupName, setGroupName] = useState('')
	const [friendList, setFriendList] = useState([<label></label>])
	const [checkboxState, setCheckboxState] = useState([false])
	
	const handleCheckedBox = (e:any) => {
		//set state.value = !state.value
		let tmp = checkboxState
		tmp[e.target.value] = tmp[e.target.value] ? !tmp[e.target.value] : true
		setCheckboxState(tmp)

		console.log(checkboxState)
	}

	useEffect(() => {
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
	}, [setFriendList])

	const groupSubmit = () => {
		//send all the firend id of checkboxState that are true
	}

	return <div className='CreateGroupPopup'>
		<div className='groupName'>
			<label htmlFor='groupName'>Group Name :</label>
			<input id='groupName' name='groupName' type="text" placeholder="Group Name" onChange={(e) => (setGroupName(e.target.value))} autoFocus />
		</div>
		<div className='friendList'>
			{friendList}
		</div>
		<button onSubmit={groupSubmit}>Create Group</button>
	</div>
}

export default CreateGroupPopup