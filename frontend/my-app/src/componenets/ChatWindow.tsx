import { useEffect, useState } from 'react'
import '../styles/Chat.scss'
import ChatInput from './ChatInput'
import Conv from './Conv'
import Message from './Message'
import Popup from './Popup'
import ChooseFriend from './ChooseFriend'
import axios from 'axios'

const ChatWindow = () => {
	const [popup, setPopup] = useState(false)
	const [convList, setConvList] = useState([<Conv key='' name='' img_path=''/>])


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
			console.log(res)
			const list = []

			for (let i of res)
				list.push(<Conv key={i.conv_id} name={i.username} img_path='https://upload.wikimedia.org/wikipedia/commons/1/11/Test-Logo.svg'/>)

			setConvList(list)
		}
		fetchConvList()
	}, [popup])

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