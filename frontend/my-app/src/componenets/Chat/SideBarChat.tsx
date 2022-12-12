import axios from 'axios'
import { useEffect } from 'react'
import Conv from './Conv'
import './Chat.scss'

const SideBarChat = (props:{conv:number, setConv: (v:number)=>void, convList:JSX.Element[], setConvList:(v:JSX.Element[])=>void, convListPrivate:JSX.Element[], setConvListPrivate:(v:JSX.Element[])=>void, popup:boolean, nav:number, refreshConvList: boolean,setRefreshConvList: (v:boolean)=>void, setisConvPrivate:(v:boolean)=>void}) => {
	const setConvCpy = props.setConv
	const setConvListCpy = props.setConvList
	const setConvListPrivateCpy = props.setConvListPrivate
	const popupCpy = props.popup
	const navCpy = props.nav
	const request = props.nav === 1 ? 'get_all_conv' : 'get_all_group_conv'
	const refreshConvListCpy = props.refreshConvList
	const setRefreshConvListCpy = props.setRefreshConvList
	const setisConvPrivateCpy = props.setisConvPrivate

	useEffect(() =>{
		const fetchConvList = async () => {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})

			await axInst.post(request).then(res => {
				const list = []
				const listPrivate = []

				for (let i of res.data){
					if (navCpy === 1)
						list.push(<Conv
							key={i.conv_id} name={i.username} img_path={i.pp} conv_id={i.conv_id}
							setConv={setConvCpy} isPrivate={i.isPrivate} setisConvPrivate={setisConvPrivateCpy}
						/>)
					else{
						if (i.isPrivate)
							listPrivate.push(<Conv
								key={i.group_conv_id} name={i.group_name} img_path={''} conv_id={i.group_conv_id}
								setConv={setConvCpy} isPrivate={i.isPrivate} setisConvPrivate={setisConvPrivateCpy}
							/>)
						else
							list.push(<Conv
								key={i.group_conv_id} name={i.group_name} img_path={''} conv_id={i.group_conv_id}
								setConv={setConvCpy} isPrivate={i.isPrivate} setisConvPrivate={setisConvPrivateCpy}
							/>)
					}
				}
				
				setConvListCpy(list)
				setConvListPrivateCpy(listPrivate)
			})
		}
		fetchConvList()
		setRefreshConvListCpy(false)
	}, [popupCpy, setConvListCpy, setConvCpy, navCpy, refreshConvListCpy, setRefreshConvListCpy, request, setConvListPrivateCpy, setisConvPrivateCpy])

	const body = props.nav === 1 ? <div className='body-nav-bar'>
		{props.convList}
	</div>
	: <div className='body-nav-bar'>
		<div className='public'>
			<h2>Public</h2>
			{props.convList}
		</div>
		<div className='private'>
			<h2>Private</h2>
			{props.convListPrivate}
		</div>
	</div>

	return <>{body}</>
}

export default SideBarChat