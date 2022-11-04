import Button_42_Connect from "../componenets/Button_42_connect"
import NavBar from "../componenets/NavBar"
import "../styles/Login.css"

const Login = () => {
	return (
		<div>
			<NavBar />
			<div className="btn-center-lgn">
				<Button_42_Connect />
			</div>
		</div>
	)
}

export default Login