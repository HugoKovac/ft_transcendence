import Button42Connect from "../componenets/Login/Button_42_connect"
import NavBar from "../componenets/NavBar"
import "../componenets/Login/Login.css"


const Login = () => {
	return (
		<div>
			<NavBar />
			<div className="btn-center-lgn">
				<Button42Connect />
			</div>
		</div>
	)
}

export default Login