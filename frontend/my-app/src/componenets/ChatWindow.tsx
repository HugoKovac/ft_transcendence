import { useContext, useState } from 'react'
import '../styles/Chat.scss'
import LoginStateContext from './LoginStateContext'
import NavBarChat from './NavBarChat'
import Conv from './Conv'
import SideBarChat from './SideBarChat'
import ChatBox from './ChatBox'
import NewConvBtn from './NewConvBtn'

const ChatWindow = () => {
	const {logState} = useContext(LoginStateContext)
	const [popup, setPopup] = useState(false)
	const [newMsg, setNewMsg] = useState(false)
	const [conv, setConv] = useState(0)
	const [convList, setConvList] = useState([<Conv key='' name='' img_path='' conv_id={0} setConv={()=>{}}/>])
	const [nav, setNav] = useState(1)

	const convMode = () => {
		setConv(0)
		setNav(1)
	}
	
	const groupMode = () => {
		setConv(0)
		setNav(2)
	}

	return <div className="ChatWindow">
		<div className='chatMenu'>
			<NavBarChat nav={nav} convMode={convMode} groupMode={groupMode}/>
			<SideBarChat conv={conv} setConv={setConv} convList={convList} setConvList={setConvList} popup={popup} nav={nav} />
			<NewConvBtn popup={popup} setPopup={setPopup} convList={convList} nav={nav} />
		</div>
		<ChatBox conv={conv} logState={logState} newMsg={newMsg} setNewMsg={setNewMsg} nav={nav}/>
	</div>
}

export default ChatWindow