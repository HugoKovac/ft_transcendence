import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import './CreateGroupPopup.scss'
import LoginStateContext from '../Login/LoginStateContext'
import 'react-toastify/dist/ReactToastify.css';

type Friend = {
	id: number,
	friend_id: number,
	friend_username: string
}

const ChoiceFriend = ({ friend_id, friend_username, onChange }: { friend_id: number, friend_username: string, onChange: (e: any) => void }) => {
	return <li>
		<label>{friend_username}</label>
		<input onChange={onChange} value={friend_id} type="checkbox" />
	</li>
}

const CreateGroupPopup = (props: { setPopup: (v: boolean) => void }) => {
	const [groupName, setGroupName] = useState('')
	const [friendList, setFriendList] = useState<JSX.Element[]>([])
	const [checkboxState, setCheckboxState] = useState([false])
	const { logState } = useContext(LoginStateContext)


	useEffect(() => {
		const handleCheckedBox = (e: any) => {
			let tmp = checkboxState
			tmp[e.target.value] = tmp[e.target.value] ? !tmp[e.target.value] : true
			setCheckboxState(tmp)
		}

		async function get() {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/friends/',
				withCredentials: true
			})
			await axInst.get('list').then((res) => {
				let list = res.data
				setFriendList(list.map((i: Friend) => (<ChoiceFriend key={i.friend_id} friend_id={i.friend_id} friend_username={i.friend_username} onChange={handleCheckedBox} />)))
			}).catch((e) => { console.error(e) })
		}
		get()
	}, [setFriendList, checkboxState])

	const groupSubmit = async () => {
		let addList: number[] = []

		for (let i in checkboxState)
			if (checkboxState[i] === true)
				addList.push(parseInt(i))

		addList.push(logState)

		const payload = {
			user_ids: addList,
			group_name: groupName
		}

		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/message/',
			withCredentials: true
		})
		await axInst.post('new_group_conv', payload).then((res) => {
			// console.log(res.data)
			props.setPopup(false)
		}).catch((e) => { toast.error(e.response.data.message[0]) })
	}

	return <div key={5465} className='CreateGroupPopup'>
		<ToastContainer />
		<div className='groupName'>
			<label htmlFor='groupName'>Group Name :</label>
			<input id='groupName' name='groupName' type="text" placeholder="Group Name" maxLength={35} onChange={(e) => (setGroupName(e.target.value))} autoFocus />
		</div>
		<div className='friendList'>
			<ul>
				{friendList}
			</ul>
		</div>
		<button onClick={groupSubmit}>Create Group</button>
	</div>
}

export default CreateGroupPopup