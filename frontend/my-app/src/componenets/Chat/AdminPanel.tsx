import axios from 'axios'
import { useState, useContext, useEffect } from 'react'
import LoginStateContext from '../Login/LoginStateContext'
import './AdminPanel.scss'
import { userType } from './ChatBox'

const AdminPanel = (props: {nav: number, userGroupList:userType[]}) => {

	const [groupName, setGroupName] = useState('')
	const [friendList, setFriendList] = useState([<label></label>])
	const [checkboxState, setCheckboxState] = useState([false])
	const {logState} = useContext(LoginStateContext)
	const userGroupListCpy = props.userGroupList
	
	
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
				console.log(userGroupListCpy)
				await axInst.get('list').then((res) => {
					let list = []
					for (let i of res.data){
						let push = true
						for (let j of userGroupListCpy){
							if (i.friend_id === j.id)
								push = false
						}
						if (push)
							list.push(<label key={i.friend_id}><input onChange={handleCheckedBox} value={i.friend_id} type="checkbox" /> {i.friend_username}</label>)
					}
					setFriendList(list)
				})
			}
			catch{
				console.error('Error with fetch of http://localhost:3000/api/friends/list')
			}
		}
		get()
	}, [setFriendList, checkboxState, userGroupListCpy])

	const updateSubmit = async () => {
		alert(1)
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


	const addFriends = props.nav === 2 ? <div className='add-users'>
			{friendList}
	</div>
	: <></>

	return <div className="AdminPanel">
		<div className='infoWrap'>
			<form>
				<label htmlFor="changeName">Change Group Name : </label>
				<input type="text" maxLength={35} placeholder='Group Name' id="changeName" />
			</form>
			<form>
				<label htmlFor="isPrivate">Private : </label>
				<input type="checkbox" id="isPrivate" />
			</form>
			{addFriends}
		</div>
		<button className='save-btn' onClick={updateSubmit}>Save</button>
	</div>
}

export default AdminPanel