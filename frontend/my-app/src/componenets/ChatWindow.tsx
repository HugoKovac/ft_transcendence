import { useContext, useState } from 'react'
import '../styles/Chat.scss'
import Message from './Message'
import LoginStateContext from './LoginStateContext'
import NavBarChat from './NavBarChat'
import Conv from './Conv'
import SideBarChat from './SideBarChat'
import ChatBox from './ChatBox'
import NewConvBtn from './NewConvBtn'
import SideBarGroupChat from './SideBarGroupChat'
import NewGroupConvBtn from './NewGroupConvBtn'

const ChatWindow = () => {
	const {logState} = useContext(LoginStateContext)
	const [popup, setPopup] = useState(false)
	const [newMsg, setNewMsg] = useState(false)
	const [conv, setConv] = useState(0)
	const [convList, setConvList] = useState([<Conv key='' name='' img_path='' user_id_2={0} setConv={()=>{}}/>])
	const [msgList, setMsgList] = useState([<Message key='' content='' own={true} username='' userPP='' date='' />])
	const [nav, setNav] = useState(1)

	const convMode = () => {
		setNav(1)
	}
	
	const groupMode = () => {
		setNav(2)
	}

	

	return <div className="ChatWindow">
		<div className='chatMenu'>
			<NavBarChat nav={nav} convMode={convMode} groupMode={groupMode}/>
			<SideBarChat conv={conv} setConv={setConv} convList={convList} setConvList={setConvList} popup={popup} nav={nav} />
			<SideBarGroupChat conv={conv} setConv={setConv} convList={convList} setConvList={setConvList} popup={popup} nav={nav} />
			<NewConvBtn popup={popup} setPopup={setPopup} convList={convList} nav={nav} />
			<NewGroupConvBtn popup={popup} setPopup={setPopup} convList={convList} nav={nav} />
		</div>
		<ChatBox conv={conv} logState={logState} newMsg={newMsg} setNewMsg={setNewMsg} msgList={msgList} setMsgList={setMsgList} />
	</div>
}

export default ChatWindow