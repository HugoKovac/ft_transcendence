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
import ChatBox from './ChatBox'

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

	const convMode = () => {
		setNav(1)
	}
	
	const groupMode = () => {
		setNav(2)
	}

	

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
		<ChatBox conv={conv} logState={logState} newMsg={newMsg} setNewMsg={setNewMsg} msgList={msgList} setMsgList={setMsgList} />
	</div>
}

export default ChatWindow