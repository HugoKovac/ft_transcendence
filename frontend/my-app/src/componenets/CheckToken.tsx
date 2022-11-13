import { useEffect } from "react"
import { useContext } from "react"
import { Navigate } from "react-router-dom"
import LoginStateContext, { CheckLogState } from "./LoginStateContext"


function CheckToken(){
	localStorage.setItem('jwt', 'true')
	const {logState, setLogState} = useContext(LoginStateContext)
	useEffect(() => {CheckLogState(logState, setLogState)}, [])

	return <Navigate to='/' />
}

export default CheckToken