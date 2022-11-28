import { useContext, useEffect, useState } from 'react'
import '../styles/Chat.scss'
import ChatInput from './ChatInput'
import Conv from './Conv'
import Message from './Message'
import Popup from './Popup'
import ChooseFriend from './ChooseFriend'
import axios from 'axios'
import LoginStateContext from './LoginStateContext'

const ChatWindow = () => {
	const {logState} = useContext(LoginStateContext)
	const [popup, setPopup] = useState(false)
	const [newMsg, setNewMsg] = useState(false)
	const [convList, setConvList] = useState([<Conv key='' name='' img_path=''/>])
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
				list.push(<Conv key={i.conv_id} name={i.username} img_path={i.pp}/>)

			setConvList(list)
		}
		fetchConvList()
	}, [popup, setConvList])

	useEffect(() =>{
		const fetchMsg = async () => {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})

			const res = await axInst.post('get_conv_msg',{user_id_2: 7}).then(res => res.data)

			const list = []

			for (let i of res){
				list.unshift(<Message key={i.msg_id} own={i.sender_id == logState ? true : false} content={i.message}/>)
			}

			setMsgList(list)
			setNewMsg(false)
		}
		fetchMsg()
	}, [newMsg, setNewMsg, logState, setMsgList])

	return <div className="ChatWindow">
		<div className='chatMenu'>
			{convList}
			<button className='btn-pup' onClick={handlePopup}>+ New Conversation</button>
			<Popup trigger={popup} setter={{popup, setPopup}}>
				<h1>Choose a friend :</h1>
				<ChooseFriend setPopup={setPopup} />
			</Popup>
		</div>
		<div className='chatBox'>
			<div className='msgArea'>
				{msgList}
			</div>
			<ChatInput friend_id={7} state={setNewMsg}/>
		</div>
	</div>
}

export default ChatWindow