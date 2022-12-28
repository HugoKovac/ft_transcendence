import Cookies from 'js-cookie'
import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginStateContext, { CheckLogState } from './Login/LoginStateContext';
import { UserStatusContext } from './Login/UserStatusContext';

function RemoveJWT(setLog: (log:boolean)=>void){
	Cookies.remove('jwt', { sameSite: 'strict' })
	setLog(false)
}

function Disconnect(){
	const [log, setLog] = useState(true)
	const nav = useNavigate()
	const {logState, setLogState} = useContext(LoginStateContext)
	const Status = useContext(UserStatusContext);

	useEffect( () => {
		if (log === false){
			CheckLogState(logState, setLogState, true)
			Status.disconnect();
			nav('/')
		}
	}, [log, setLog, logState, setLogState, nav])

	return (
		<div>
			<button onClick={() => {RemoveJWT(setLog)}}>Disconnect</button>
		</div>
	)
}

export default Disconnect