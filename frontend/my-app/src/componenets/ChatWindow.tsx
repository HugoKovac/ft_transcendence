import '../styles/Chat.scss'
import ChatInput from './ChatInput'
import Conv from './Conv'
import Message from './Message'
import Popup from './Popup'

const ChatWindow = () => {

	const handlePopup = () =>{
		return <Popup />
	}

	return <div className="ChatWindow">
		<div className='chatMenu'>
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<Conv name='testName' img_path='https://www.teachervision.com/sites/default/files/inline-images/Test-Prep.jpg' />
			<button className='btn' onClick={handlePopup}>+ New Conversation</button>
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
			<ChatInput friend_id={3}/>
		</div>
	</div>
}

export default ChatWindow