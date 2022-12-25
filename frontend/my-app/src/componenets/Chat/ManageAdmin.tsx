import axios from "axios"
import React, { useEffect, useState } from "react"

const ManageAdmin = (props:{conv_id:number, setPanelTrigger: (v:boolean)=>void, setPopAdmin: (v:boolean)=>void}) =>{
	const [adminCheckbox, setAdminCheckbox] = useState([false])
	const [groupUserList, setGroupUserList] = useState<JSX.Element[]>([])
	const convCpy = props.conv_id
	
	useEffect(() => {
		const handleChange = (e:any) =>{
			setAdminCheckbox((v) => {
				v[e.target.value] = v[e.target.value] ? !v[e.target.value] : true
				return v
			})
			setGroupUserList((v) => {
				let rtn = []

				for (let i of v)
					if (i.props.children[0].props.value !== e.target.value)
						rtn.push(i)
					else
						rtn.push(<label key={i.props.children[0].props.value}><input value={i.props.children[0].props.value} type='checkbox' checked={adminCheckbox[i.props.children[0].props.value]} onChange={i.props.children[0].props.onChange}/>{i.props.children[1]}</label>)

				return rtn
			})
		}

		const get = async () => {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})
			try{
				await axInst.post('get_conv_users', {group_conv_id: convCpy}).then((res)=>{
					let list = []
					for (let i of res.data){
						adminCheckbox[i.id] = i.admin
						list.push(<label key={i.id}><input value={i.id} type='checkbox' checked={adminCheckbox[i.id]} onChange={handleChange}/>{i.username}</label>)//!
					}

					setGroupUserList(list)
				})
			}catch(e){
				console.error(e)
			}
		}
		get()
	}, [convCpy, adminCheckbox])
	
	const submitNewAdmin = async() =>{
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/message/',
			withCredentials: true
		})
		let ids = []
		for (let i in adminCheckbox)
			if (adminCheckbox[i] === true)
				ids.push(parseInt(i))

		await axInst.post('new_admin', {group_conv_id: props.conv_id, admin_ids: ids}).then((res) => {
			// console.log(res.data)
			props.setPopAdmin(false)
			props.setPanelTrigger(false)
		}).catch((e) => {
			console.error(e)
		})

		let del = []
		for (let i in adminCheckbox)
			if (adminCheckbox[i] === false)
				del.push(parseInt(i))
		await axInst.post('del_admin', {group_conv_id: props.conv_id, admin_ids: del}).then((res) => {
			console.log(res.data)
		}).catch((e) => {
			console.error(e)
		})
	}


	return <React.Fragment>
		<h1>Add Admin:</h1>
		<div className='list-group-member'>
			{groupUserList}
		</div>
		<button className='submit-admin' onClick={submitNewAdmin}>submit</button>
	</React.Fragment>
}

export default ManageAdmin