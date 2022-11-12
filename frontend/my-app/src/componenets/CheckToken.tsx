import axios from "axios"
import { useEffect, useContext } from "react"
import { Navigate } from "react-router-dom"
import LoginStateContext from "./LoginStateContext"

export function IsLog(){
	const {logState, setLogState} = useContext(LoginStateContext)

	const axInst = axios.create({
		baseURL: 'http://localhost:3000/api/',
		withCredentials: true,
	})

	useEffect(
		() => {axInst.get('auth/logged').then((res) => {setLogState(res.data)})}, []
	)

		console.log(`logState in IsLog() = ${logState}`)

	return logState
}

function CheckToken(){
	IsLog()
	return <Navigate to='/' />
}

export default CheckToken