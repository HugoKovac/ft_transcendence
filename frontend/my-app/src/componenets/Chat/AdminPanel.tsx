import axios from 'axios'
import Cookies from 'js-cookie'
import { useState, useContext, useEffect } from 'react'
import { io } from 'socket.io-client'
import LoginStateContext from '../Login/LoginStateContext'
import Popup from '../Popup'
import './AdminPanel.scss'
import { userType } from './ChatBox'
import ManageAdmin from './ManageAdmin'

const FriendComponent = ({ handleCheckedBox, friend_id, friend_username }: { handleCheckedBox: (e: any) => void, friend_id: number, friend_username: string }) => {
	return <li>
		<input onChange={handleCheckedBox} value={friend_id} type="checkbox" /> {friend_username}
	</li>
}

const DelComponent = ({ id, handleCheckedBox, handleSetTime, username }: { id: number, handleCheckedBox: (e: any) => void, handleSetTime: (id: number, isBan: number) => void, username: string }) => {
	return <li>
		<input onChange={handleCheckedBox} value={id} type="checkbox" /> {username}
		<button className='ban' onClick={() => { handleSetTime(id, 1) }}>Ban</button>{/**Popup to set time of Mute*/}
		<button className='mute' onClick={() => { handleSetTime(id, 0) }}>Mute</button>{/**Popup to set time of Mute*/}
	</li>
}

const AdminPanel = (props: { userGroupList: userType[], conv_id: number, setConv: (v: number) => void, setPanelTrigger: (v: boolean) => void, setRefreshConvList: (v: boolean) => void, isConvPrivate: boolean, passwordInput: string, setPasswordInput: (v: string) => void, setRefresh: (e:boolean)=>void }) => {

	const [groupName, setGroupName] = useState('')
	const [friendList, setFriendList] = useState<JSX.Element[]>([])
	const [delList, setDelList] = useState<JSX.Element[]>([])
	const [checkboxState, setCheckboxState] = useState([false])
	const [delCheckboxState, setDelCheckboxState] = useState([false])
	const [privateState, setPrivateState] = useState(props.isConvPrivate)
	const [asChange, setAsChange] = useState(false)
	const [popAdmin, setPopAdmin] = useState(false)
	const userGroupListCpy = props.userGroupList
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
			try {
				await axInst.get('list').then((res) => {
					let list: JSX.Element[] = []
					for (let i of res.data) {
						let push = true
						for (let j of userGroupListCpy) {
							if (i.friend_id === j.id)
								push = false
						}
						if (push)
							list.push(<FriendComponent key={i.friend_id} handleCheckedBox={handleCheckedBox} friend_id={i.friend_id} friend_username={i.friend_username} />)
					}
					setFriendList(list)
				})
			}
			catch {
				console.error('Error with fetch of http://localhost:3000/api/friends/list')
			}
		}
		get()
	}, [setFriendList, checkboxState, userGroupListCpy])

	const [to, setTo] = useState(false)
	const [toInfo, setToInfo] = useState([0, 0])
	const handleSetTime = async (id: number, isBan: number) => {
		setTo(true)
		setToInfo([id, isBan])
	}

	useEffect(() => {
		const handleCheckedBox = (e: any) => {
			let tmp = delCheckboxState
			tmp[e.target.value] = tmp[e.target.value] ? !tmp[e.target.value] : true
			setDelCheckboxState(tmp)
		}

		let list: JSX.Element[] = []
		for (let i of userGroupListCpy)
			if (parseInt(i.id.toString()) !== logState)
				list.push(<DelComponent key={i.id} id={i.id} username={i.username} handleCheckedBox={handleCheckedBox} handleSetTime={handleSetTime} />)

		setDelList(list)
	}, [setDelList, setDelCheckboxState, userGroupListCpy, delCheckboxState, logState])

	const updateSubmit = async () => {
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/message/',
			withCredentials: true
		})
		try {
			let addList: number[] = []
			let delList: number[] = []

			for (let i in checkboxState) {
				// console.log(i, checkboxState[i])
				if (checkboxState[i] === true)
					addList.push(parseInt(i))
			}

			await axInst.post('add_user_to_group', { group_conv_id: props.conv_id, new_user_ids: addList }).then((res) => {
				// console.log(res.data)
			})

			for (let i in delCheckboxState) {
				// console.log(i, delCheckboxState[i])
				if (delCheckboxState[i] === true)
					delList.push(parseInt(i))
			}

			await axInst.post('del_user_to_group', { group_conv_id: props.conv_id, del_user_ids: delList }).then((res) => {
				// console.log(res.data)
			})

			await axInst.post('change_group_name', { group_conv_id: props.conv_id, new_name: groupName }).then((res) => {
				// console.log(res.data)
			})

			await axInst.post('change_group_visibility', { group_conv_id: props.conv_id, isPrivate: privateState }).then((res) => {
				// console.log(res.data)
			})

			if (privateState === true) {
				await axInst.post('set_password', { group_conv_id: props.conv_id, password: props.passwordInput }).then((res) => {
					// console.log(res.data)
				})
			}

			if (asChange)
				props.setConv(0)

			const socket = io("localhost:3000", {
				auth: (cb) => {
					cb({
						token: Cookies.get('jwt')
					});
				}
			})

			socket.emit('refreshConv', { group_conv_id: props.conv_id })

			props.setPanelTrigger(false)
			props.setRefreshConvList(true)
			props.setRefresh(true)
			
		}
		catch {
			console.error('Error with fetch of http://localhost:3000/api/message/ addList || delList || change_group_name')
		}
	}

	const [time, setTime] = useState<string>('')

	const sendTime = async () => {
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/message/',
			withCredentials: true
		})

		if (toInfo[1]) {
			await axInst.post('ban_user', { group_conv_id: props.conv_id, user_id: parseInt(toInfo[0].toString()), to: parseInt(time) }).then((res) => {
				// console.log(res.data)
				setTo(false)

				const socket = io("localhost:3000", {
					auth: (cb) => {
						cb({
							token: Cookies.get('jwt')
						});
					}
				})

				socket.emit('ban', { group_conv_id: props.conv_id, user_id: parseInt(toInfo[0].toString()), to: parseInt(time) })

				return (() => { socket.off('ban') })

			}).catch((e) => {
				console.error(e)
			})
		}
		else if (!toInfo[1]) {
			await axInst.post('mute_user', { group_conv_id: props.conv_id, user_id: parseInt(toInfo[0].toString()), to: parseInt(time) }).then((res) => {
				// console.log(res.data)
				setTo(false)
			}).catch((e) => {
				console.error(e)
			})
		}
	}


	const groupPass = privateState === true
		? <><label htmlFor="isPrivate">Password : </label>
			<input type="password" id="password" placeholder='Required If Private' minLength={12} maxLength={35} onChange={(e) => { props.setPasswordInput(e.target.value) }} /></>
		: <></>

	return <div className="AdminPanel">
		<div className='infoWrap'>
			<div className='form'>
				<label htmlFor="changeName">Change Group Name : </label>
				<input type="text" maxLength={35} placeholder='Group Name' id="changeName" onChange={(e) => { setGroupName(e.target.value) }} />
			</div>
			<div className='form'>
				<label htmlFor="isPrivate">Private : </label>
				<input type="checkbox" id="isPrivate" checked={privateState} onChange={(e) => { setPrivateState(!privateState); setAsChange(true) }} />
				{groupPass}
			</div>
			<div className='del-users'>
				<h2>Select User(s) to remove :</h2>
				<ul>
					{delList}
				</ul>
			</div>
			<div className='add-users'>
				<h2>Select User(s) to add :</h2>
				<ul>
					{friendList}
				</ul>
			</div>
		</div>
		<Popup key={'general'} trigger={popAdmin} setPopup={setPopAdmin}>
			<ManageAdmin conv_id={props.conv_id} setPanelTrigger={props.setPanelTrigger} setPopAdmin={setPopAdmin} />
		</Popup>
		<Popup key={'admin'} trigger={to} setPopup={setTo}>
			<h1>Set Time Out</h1>
			<div className='form-to'>
				<label htmlFor="time">Time in seconds :</label>
				<input name='time' type="number" onChange={(e) => { setTime(e.target.value) }} />
				<button onClick={sendTime}>Submit</button>
			</div>
		</Popup>
		<div className='bot-wrpper'>
			<button className='add-min-btn' onClick={() => { setPopAdmin(true) }}>Add Admin</button>
			<button className='save-btn' onClick={updateSubmit}>Save</button>
		</div>
	</div>
}

export default AdminPanel