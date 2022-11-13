import axios from "axios"
import { createContext, useState } from "react"

type ObjLoginStateContext = {
	logState: boolean,
	setLogState: (state: boolean) => void
}

export const LoginStateContext = createContext<ObjLoginStateContext>({
	logState: false,
	setLogState : () => {}
})

async function ReqApiLogState(): Promise<boolean>{
	const axInst = axios.create({
		baseURL: 'http://localhost:3000/api/',
		withCredentials: true,
	})
	
	let rtn:boolean = false

	rtn = await axInst.get('auth/logged').then((res) => {return JSON.parse(res.data)})

	return rtn
}

export async function CheckLogState(logState: boolean, setLogState: (state: boolean) => void){
	if (localStorage.getItem('jwt') === 'true')
		setLogState(await ReqApiLogState())	
}

export const LoginStateProvider = ({children}:any) => {

	const [logState, setLogState] = useState(false)

	return (
		<LoginStateContext.Provider value={{ logState, setLogState }}>
			{children}
		</LoginStateContext.Provider>
	)
}

export default LoginStateContext