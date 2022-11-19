import axios from "axios"
import { createContext, useState } from "react"

type ObjLoginStateContext = {
	logState: number,
	setLogState: (state: number) => void
}

export const LoginStateContext = createContext<ObjLoginStateContext>({
	logState: 0,
	setLogState : () => {}
})

async function ReqApiLogState(): Promise<number>{
	const axInst = axios.create({
		baseURL: 'http://localhost:3000/api/',
		withCredentials: true,
	})
	
	console.log('request api')

	let rtn:number = 0

	rtn = await axInst.get('auth/logged').then((res) => {return JSON.parse(res.data)})

	return rtn
}

export async function CheckLogState(logState: number, setLogState: (state: number) => void, check : boolean = false){
	console.log(`check logState: ${localStorage.getItem('jwt')}`)
	if ((localStorage.getItem('jwt') !== '0') || check)
		setLogState(await ReqApiLogState())
}

export const LoginStateProvider = ({children}:any) => {

	const [logState, setLogState] = useState(0)

	return (
		<LoginStateContext.Provider value={{ logState, setLogState }}>
			{children}
		</LoginStateContext.Provider>
	)
}

export default LoginStateContext