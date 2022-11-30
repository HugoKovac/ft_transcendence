import { useContext, useEffect, useState } from 'react'
import '../styles/Chat.scss'
import Message from './Message'
import Popup from './Popup'
import ChooseFriend from './ChooseFriend'
import axios from 'axios'
import LoginStateContext from './LoginStateContext'
import ChatRight from '../ChatRight'
import NavBarChat from './NavBarChat'
import Conv from './Conv'
import SideBarChat from './SideBarChat'

const ChatWindow = () => {
	const {logState} = useContext(LoginStateContext)
	const [popup, setPopup] = useState(false)
	const [newMsg, setNewMsg] = useState(false)
	const [conv, setConv] = useState(0)
	const [convList, setConvList] = useState([<Conv key='' name='' img_path='' user_id_2={0} setConv={()=>{}}/>])
	const [msgList, setMsgList] = useState([<Message key='' content='' own={true} username='' userPP='' date='' />])
	const [nav, setNav] = useState(1)


	const handlePopup = () =>{
		setPopup(true)
	}

	useEffect(() =>{
		if (conv === 0)
			return
		const fetchMsg = async () => {
			const axInst = axios.create({
				baseURL: 'http://localhost:3000/api/message/',
				withCredentials: true
			})

			axInst.post('get_conv_msg',{user_id_2: conv}).then(res => {
				console.log(res.data)
				const list = []
				for (let i of res.data.message){
					const user = i.sender_id == res.data.user.id ? res.data.user : res.data.user2
					list.unshift(<Message key={i.msg_id} own={i.sender_id === logState ? true : false} content={i.message} username={user.username} userPP={user.pp} date={i.send_at}/>)
				}
				setMsgList(list)
			}).catch(e => {console.error('error when fetch http://localhost:3000/api/message/get_conv_msg')})

			setNewMsg(false)
		}
		fetchMsg()
	}, [newMsg, setNewMsg, logState, setMsgList, conv])

	const convMode = () => {
		setNav(1)
	}
	
	const groupMode = () => {
		setNav(2)
	}

	let right = <ChatRight conv={conv} msgList={msgList} setNewMsg={setNewMsg} />
	if (conv === 0)
		right = <div className='chatBox' />

	return <div className="ChatWindow">
		<div className='chatMenu'>
			<NavBarChat nav={nav} convMode={convMode} groupMode={groupMode}/>
			<SideBarChat conv={conv} setConv={setConv} convList={convList} setConvList={setConvList} popup={popup} />
			<button className='btn-pup' onClick={handlePopup}>+ New Conversation</button>
			<Popup trigger={popup} setter={{popup, setPopup}}>
				<h1>Choose a friend :</h1>
				<ChooseFriend setPopup={setPopup} convList={convList}/>
			</Popup>
		</div>
		{right}
	</div>
}

export default ChatWindow