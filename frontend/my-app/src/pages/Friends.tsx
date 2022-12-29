import AddFriend from "../componenets/AddFriend"
import ListRelative from "../componenets/relatives/ListRelative"
import FriendsList from "../componenets/FriendsList"
import NavBar from "../componenets/NavBar"

const Friends = () => {
	return <div>
		<NavBar />
		<h1>Friends</h1>
		<AddFriend />
		<ListRelative />
	</div>
}

export default Friends