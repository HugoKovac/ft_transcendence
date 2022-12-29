import { useEffect } from "react"
import { useContext } from "react"
import { Navigate } from "react-router-dom"
import LoginStateContext, { CheckLogState } from "./LoginStateContext"

export async function CheckTokenFirstMount(){
	const {logState, setLogState} = useContext(LoginStateContext)
	
	useEffect(
		() => {
			const fetchLogState = async () => {
				try{
					await CheckLogState(logState, setLogState)
					localStorage.setItem('jwt', JSON.stringify(logState))
				}catch(e){
					console.log(e)
				}
			}
			fetchLogState()
		}
		, [logState, setLogState])
	}
	
	function CheckTokenAfterLogin(){
		localStorage.setItem('jwt', 'true')
		const {logState, setLogState} = useContext(LoginStateContext)
		useEffect(() => {CheckLogState(logState, setLogState)}, [logState, setLogState])

		return <Navigate to='/' />
	}

export default CheckTokenAfterLogin