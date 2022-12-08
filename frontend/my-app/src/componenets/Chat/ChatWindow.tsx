import { useContext, useState } from 'react'
import './Chat.scss'
import LoginStateContext from '../Login/LoginStateContext'
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
	const [isConvSecret, setIsConvSecret] = useState(false)
	const [convList, setConvList] = useState([<Conv key='' name='' img_path='' conv_id={0} setConv={()=>{}} isPrivate={false} setIsConvSecret={()=>{}}/>])
	const [convListPrivate, setConvListPrivate] = useState([<Conv key='' name='' img_path='' conv_id={0} setConv={()=>{}} isPrivate={false} setIsConvSecret={()=>{}}/>])
	const [nav, setNav] = useState(1)
	const [refreshConvList, setRefreshConvList] = useState(false)

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
			<div className='chatMenuTop'>
				<NavBarChat nav={nav} convMode={convMode} groupMode={groupMode}/>
				<SideBarChat
					conv={conv} setConv={setConv} convList={convList} setConvList={setConvList}
					convListPrivate={convListPrivate} setConvListPrivate={setConvListPrivate}
					popup={popup} nav={nav} refreshConvList={refreshConvList}
					setRefreshConvList={setRefreshConvList} setIsConvSecret={setIsConvSecret}
				/>
			</div>
			<NewConvBtn popup={popup} setPopup={setPopup} convList={convList} nav={nav} />
		</div>
		<ChatBox conv={conv} logState={logState} newMsg={newMsg} setNewMsg={setNewMsg}
			nav={nav} setRefreshConvList={setRefreshConvList} isConvSecret={isConvSecret}
		/>
	</div>
}

export default ChatWindow