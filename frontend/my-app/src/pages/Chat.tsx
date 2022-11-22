import { useContext } from "react"
import ChatHandle from "../componenets/ChatHandle"
import Conv from "../componenets/Conv"
import LoginStateContext from "../componenets/LoginStateContext"
import NavBar from "../componenets/NavBar"

const Chat = () => {
	const {logState} = useContext(LoginStateContext)

	return (
		<div>
			<NavBar />
			<Conv user_id={logState} friend_id={667} />
			<ChatHandle />
		</div>
	)
}

export default Chat