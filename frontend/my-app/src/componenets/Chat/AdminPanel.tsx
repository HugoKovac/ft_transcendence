import axios from 'axios'
import { useState, useContext, useEffect, FormEventHandler, FormEvent } from 'react'
import './AdminPanel.scss'
import { userType } from './ChatBox'

const AdminPanel = (props: {userGroupList:userType[], conv_id: number, setPanelTrigger: (v:boolean)=>void, setRefreshConvList: (v:boolean)=>void}) => {

	const [groupName, setGroupName] = useState('')
	const [friendList, setFriendList] = useState([<label></label>])
	const [checkboxState, setCheckboxState] = useState([false])
	const userGroupListCpy = props.userGroupList
	const userGroupListHTML = userGroupListCpy.map(i => (i.username))
	
	
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
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/message/',
			withCredentials: true
		})
		try{
			let addList:number[] = []

			for (let i in checkboxState)
				if (checkboxState[i] === true)
					addList.push(parseInt(i))

			await axInst.post('add_user_to_group', {group_conv_id: props.conv_id, new_user_ids: addList}).then((res) => {
				// console.log(res.data)
			})

			await axInst.post('change_group_name', {group_conv_id: props.conv_id, new_name: groupName}).then((res) => {
				console.log(res.data)
			})

			props.setPanelTrigger(false)
			props.setRefreshConvList(true)
		}
		catch{
			console.error('Error with fetch of http://localhost:3000/api/message/addList || change_group_name')
		}
	}

	function prevDef(e: FormEvent){
		e.preventDefault()
	}

	return <div className="AdminPanel">
		<div className='infoWrap'>
			<div className='form'>
				<label htmlFor="changeName">Change Group Name : </label>
				<input type="text" maxLength={35} placeholder='Group Name' id="changeName" onChange={(e) => {setGroupName(e.target.value)}}/>
			</div>
			<div className='form'>
				<label htmlFor="isPrivate">Private : </label>
				<input type="checkbox" id="isPrivate" />
			</div>
			<div className='add-users'>
				<h2>Select User(s) to add :</h2>
				{friendList}
			</div>
			<div className='del-users'>
				<h2>Select User(s) to remove :</h2>
				{userGroupListHTML}
			</div>
		</div>
		<button className='save-btn' onClick={updateSubmit}>Save</button>
	</div>
}

export default AdminPanel