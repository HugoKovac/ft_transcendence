import axios from 'axios'
import { useState, useContext, useEffect } from 'react'
import LoginStateContext from '../Login/LoginStateContext'
import './AdminPanel.scss'
import { userType } from './ChatBox'

const AdminPanel = (props: {userGroupList:userType[], conv_id: number, setConv: (v:number)=>void, setPanelTrigger: (v:boolean)=>void, setRefreshConvList: (v:boolean)=>void, isConvPrivate:boolean, passwordInput:string, setPasswordInput:(v:string)=>void}) => {

	const [groupName, setGroupName] = useState('')
	const [friendList, setFriendList] = useState([<label></label>])
	const [delList, setDelList] = useState([<label></label>])
	const [checkboxState, setCheckboxState] = useState([false])
	const [delCheckboxState, setDelCheckboxState] = useState([false])
	const [privateState, setPrivateState] = useState(props.isConvPrivate)
	const [asChange, setAsChange] = useState(false)
	const userGroupListCpy = props.userGroupList
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

	useEffect(() => {
		const handleCheckedBox = (e:any) => {
			let tmp = delCheckboxState
			tmp[e.target.value] = tmp[e.target.value] ? !tmp[e.target.value] : true
			setDelCheckboxState(tmp)
			// console.log(delCheckboxState)
		}

		let list = []
			for (let i of userGroupListCpy)
				if (parseInt(i.id.toString()) !== logState)
					list.push(<label key={i.id}><input onChange={handleCheckedBox} value={i.id} type="checkbox" /> {i.username}</label>)
		
		setDelList(list)
	}, [setDelList, setDelCheckboxState, userGroupListCpy, delCheckboxState, logState])

	const updateSubmit = async () => {
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/message/',
			withCredentials: true
		})
		try{
			let addList:number[] = []
			let delList:number[] = []

			for (let i in checkboxState){
				// console.log(i, checkboxState[i])
				if (checkboxState[i] === true)
					addList.push(parseInt(i))
			}
			
			await axInst.post('add_user_to_group', {group_conv_id: props.conv_id, new_user_ids: addList}).then((res) => {
				// console.log(res.data)
			})

			for (let i in delCheckboxState){
				// console.log(i, delCheckboxState[i])
				if (delCheckboxState[i] === true)
					delList.push(parseInt(i))
			}

			await axInst.post('del_user_to_group', {group_conv_id: props.conv_id, del_user_ids: delList}).then((res) => {
				// console.log(res.data)
			})

			await axInst.post('change_group_name', {group_conv_id: props.conv_id, new_name: groupName}).then((res) => {
				// console.log(res.data)
			})
			
			await axInst.post('change_group_visibility', {group_conv_id: props.conv_id, isPrivate: privateState}).then((res) => {
				// console.log(res.data)
			})
			
			if (privateState === true){
				await axInst.post('set_password', {group_conv_id: props.conv_id, password: props.passwordInput}).then((res) => {
					// console.log(res.data)
				})
			}

			if (asChange)
				props.setConv(0)
			
			props.setPanelTrigger(false)
			props.setRefreshConvList(true)
		}
		catch{
			console.error('Error with fetch of http://localhost:3000/api/message/ addList || delList || change_group_name')
		}
	}

	const groupPass = privateState === true
	? <><label htmlFor="isPrivate">Password : </label>
		<input type="password" id="password" placeholder='Required If Private' minLength={12} maxLength={35} onChange={(e) => {props.setPasswordInput(e.target.value)}}/></>
	: <></>

	return <div className="AdminPanel">
		<div className='infoWrap'>
			<div className='form'>
				<label htmlFor="changeName">Change Group Name : </label>
				<input type="text" maxLength={35} placeholder='Group Name' id="changeName" onChange={(e) => {setGroupName(e.target.value)}}/>
			</div>
			<div className='form'>
				<label htmlFor="isPrivate">Private : </label>
				<input type="checkbox" id="isPrivate" checked={privateState} onChange={(e) => {setPrivateState(!privateState); setAsChange(true)}} />
				{groupPass}
			</div>
			<div className='add-users'>
				<h2>Select User(s) to add :</h2>
				{friendList}
			</div>
			<div className='del-users'>
				<h2>Select User(s) to remove :</h2>
				{delList}
			</div>
		</div>
		<button className='save-btn' onClick={updateSubmit}>Save</button>
	</div>
}

export default AdminPanel