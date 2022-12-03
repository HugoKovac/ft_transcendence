import axios from 'axios'
import { useEffect } from 'react'
import Conv from './Conv'
import '../styles/Chat.scss'

const SideBarGroupChat = (props:{conv:number, setConv: (v:number)=>void, convGroupList:JSX.Element[], setConvGroupList:(v:JSX.Element[])=>void, popup:boolean, nav:number}) => {
	const popupCpy = props.popup
	const setConvGroupListCpy = props.setConvGroupList
	const setConvCpy = props.setConv

	useEffect(() =>{
		const fetchConvList = async () => {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})

			await axInst.post('get_all_group_conv').then(res => {//get_all_group_conv
				const list = []

				for (let i of res.data){
					list.push(<Conv key={i.group_conv_id} name={i.group_name} img_path={''} conv_id={i.group_conv_id} setConv={setConvCpy}/>)
				}
				
				setConvGroupListCpy(list)
			})


		}
		fetchConvList()
	}, [popupCpy, setConvGroupListCpy, setConvCpy])

	/*Replace convList by convGroupConv*/
	return <div>
		{props.nav === 2 ? props.convGroupList : <></>}
	</div>
}

export default SideBarGroupChat