import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

function RemoveJWT(){
	Cookies.remove('jwt')
}

function Disconnect(){
	const navigate = useNavigate()

	return (
		<button onClick={RemoveJWT}>Disconned</button>
	)
}

export default Disconnect