import axios from 'axios'
import { useEffect } from 'react'
import Conv from './Conv'
import '../styles/Chat.scss'

const SideBarGroupChat = (props:{conv:number, setConv: (v:number)=>void, convList:JSX.Element[], setConvList:(v:JSX.Element[])=>void, popup:boolean, nav:number}) => {
	const popupCpy = props.popup
	const setConvListCpy = props.setConvList
	const setConvCpy = props.setConv

	useEffect(() =>{
		const fetchConvList = async () => {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})

			await axInst.post('get_all_conv').then(res => {
				const list = []
				let localRmList = []

				for (let i of res.data){
					localRmList.push(i)
					list.push(<Conv key={i.conv_id} name={i.username} img_path={i.pp} conv_id={i.conv_id} setConv={setConvCpy}/>)
				}
				
				setConvListCpy(list)
			})


		}
		fetchConvList()
	}, [popupCpy, setConvListCpy, setConvCpy])

	return <div>
		{props.nav === 2 ? props.convList : <></>}
	</div>
}

export default SideBarGroupChat