import Cookies from 'js-cookie'
import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginStateContext, { CheckLogState } from './LoginStateContext';

function RemoveJWT(setLog: (log:boolean)=>void){
	Cookies.remove('jwt', { sameSite: 'strict' })
	setLog(false)
}

function Disconnect(){
	const [log, setLog] = useState(true)
	const nav = useNavigate()
	const {logState, setLogState} = useContext(LoginStateContext)

	useEffect( () => {
		if (log === false){
			CheckLogState(logState, setLogState, true)
			nav('/')
		}
	}, [log, setLog, logState, setLogState, nav])

	return (
		<div>
			<button onClick={() => {RemoveJWT(setLog)}}>Disconned</button>
		</div>
	)
}

export default Disconnect