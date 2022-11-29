import { useContext, useEffect, useState } from 'react'
import '../styles/Chat.scss'
import Conv from './Conv'
import Message from './Message'
import Popup from './Popup'
import ChooseFriend from './ChooseFriend'
import axios from 'axios'
import LoginStateContext from './LoginStateContext'
import ChatRight from '../ChatRight'

const ChatWindow = () => {
	const {logState} = useContext(LoginStateContext)
	const [popup, setPopup] = useState(false)
	const [newMsg, setNewMsg] = useState(false)
	const [conv, setConv] = useState(0)
	const [convList, setConvList] = useState([<Conv key='' name='' img_path='' user_id_2={0} setConv={()=>{}}/>])
	const [msgList, setMsgList] = useState([<Message key='' content='' own={true} />])


	const handlePopup = () =>{
		setPopup(true)
	}

	useEffect(() =>{
		const fetchConvList = async () => {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})

			const res = await axInst.post('get_all_conv').then(res => res.data)
			const list = []

			for (let i of res)
				list.push(<Conv key={i.conv_id} name={i.username} img_path={i.pp} user_id_2={i.user_id_2} setConv={setConv}/>)

			setConvList(list)
		}
		fetchConvList()
	}, [popup, setConvList])

	useEffect(() =>{
		if (conv === 0)
			return
		const fetchMsg = async () => {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})

			axInst.post('get_conv_msg',{user_id_2: conv}).then(res => {
				const list = []
				for (let i of res.data){
					list.unshift(<Message key={i.msg_id} own={i.sender_id == logState ? true : false} content={i.message}/>)
				}
				setMsgList(list)
			}).catch(e=> {console.error('error when fetch http://localhost:3000/api/message/get_conv_msg')})

			setNewMsg(false)
		}
		fetchMsg()
	}, [newMsg, setNewMsg, logState, setMsgList, conv])


	let right = <ChatRight conv={conv} msgList={msgList} setNewMsg={setNewMsg} />
	if (conv == 0)
		right = <div className='chatBox' />

	return <div className="ChatWindow">
		<div className='chatMenu'>
			{convList}
			<button className='btn-pup' onClick={handlePopup}>+ New Conversation</button>
			<Popup trigger={popup} setter={{popup, setPopup}}>
				<h1>Choose a friend :</h1>
				<ChooseFriend setPopup={setPopup} />
			</Popup>
		</div>
		{right}
	</div>
}

export default ChatWindow