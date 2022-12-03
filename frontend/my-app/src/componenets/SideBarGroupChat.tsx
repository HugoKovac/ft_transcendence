import axios from 'axios'
import { useEffect } from 'react'
import Conv from './Conv'
import '../styles/Chat.scss'


const SideBarGroupChat = (props:{groupConv:number, setGroupConv: (v:number)=>void, convGroupList:JSX.Element[], setConvGroupList:(v:JSX.Element[])=>void, popup:boolean, nav:number}) => {
	const popupCpy = props.popup
	const setConvGroupListCpy = props.setConvGroupList
	const setGroupConvCpy = props.setGroupConv

	useEffect(() =>{
		const fetchConvList = async () => {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})

			await axInst.post('get_all_group_conv').then(res => {//get_all_group_conv
				const list = []

				for (let i of res.data){
					list.push(<Conv key={i.group_conv_id} name={i.group_name} img_path={''} conv_id={i.group_conv_id} setConv={setGroupConvCpy}/>)
				}
				
				setConvGroupListCpy(list)
			}).catch(e => {console.log(e)})


		}
		fetchConvList()
	}, [popupCpy, setConvGroupListCpy, setGroupConvCpy])

	return <div>
		{props.nav === 2 ? props.convGroupList : <></>}
	</div>
}

export default SideBarGroupChat