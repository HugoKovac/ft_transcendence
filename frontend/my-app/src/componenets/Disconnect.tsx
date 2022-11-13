import Cookies from 'js-cookie'
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
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
			CheckLogState(logState, setLogState)
			nav('/')
		}
	}, [log])

	return (
		<div>
			<button onClick={() => {RemoveJWT(setLog)}}>Disconned</button>
		</div>
	)
}

export default Disconnect