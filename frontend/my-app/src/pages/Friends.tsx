import AddFriend from "../componenets/AddFriend"
import FriendsList from "../componenets/FriendsList"
import NavBar from "../componenets/NavBar"

const Friends = () => {
	return <div>
		<NavBar />
		<h1>Friends</h1>
		<AddFriend />
		<FriendsList />
	</div>
}

export default Friends