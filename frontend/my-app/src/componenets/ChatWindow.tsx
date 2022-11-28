import { useState } from 'react'
import '../styles/Chat.scss'
import ChatInput from './ChatInput'
import Conv from './Conv'
import Message from './Message'
import Popup from './Popup'
import ChooseFriend from './ChooseFriend'

const ChatWindow = () => {
	const [popup, setPopup] = useState(false)


	const handlePopup = () =>{
		setPopup(true)
	}

	return <div className="ChatWindow">
		<div className='chatMenu'>
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<button className='btn-pup' onClick={handlePopup}>+ New Conversation</button>
			<Popup trigger={popup} setter={{popup, setPopup}}>
				<h1>Choose a friend :</h1>
				<ChooseFriend />
			</Popup>
		</div>
		<div className='chatBox'>
			<div className='msgArea'>
				<Message content='test1' own={true} />
				<Message content='test2' own={false} />
				<Message content='test3' own={true} />
				<Message content='test4' own={false} />
				<Message content='test5' own={false} />
				<Message content='test6' own={true} />
				<Message content='test7' own={false} />
				<Message content='test8' own={true} />
			</div>
			<ChatInput friend_id={2}/>
		</div>
	</div>
}

export default ChatWindow