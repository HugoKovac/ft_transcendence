import axios from "axios"
import { createContext, useState } from "react"

type ObjLoginStateContext = {
	logState: number,
	setLogState: (state: number) => void,
	rerender: boolean,
	setRerender: (state: boolean) => void,
}

export const LoginStateContext = createContext<ObjLoginStateContext>({
	logState: 0,
	setLogState : () => {},
	rerender: false,
	setRerender : () => {},
})

async function ReqApiLogState(): Promise<number>{
	const axInst = axios.create({
		baseURL: 'http://localhost:3000/api/',
		withCredentials: true,
	})
	
	const rtn:number = await axInst.get('auth/logged').then((res) => {return JSON.parse(res.data)})
	return rtn
}

export async function CheckLogState(logState: number, setLogState: (state: number) => void, check : boolean = false){
	// console.log(`check logState: ${localStorage.getItem('jwt')}`)
	if ((localStorage.getItem('jwt') !== '0') || check)
		setLogState(await ReqApiLogState())
}

export const LoginStateProvider = ({children}:any) => {

	const [logState, setLogState] = useState(0)
	const [rerender, setRerender] = useState(false)

	return (
		<LoginStateContext.Provider value={{ logState, setLogState, rerender, setRerender }}>
			{children}
		</LoginStateContext.Provider>
	)
}

export default LoginStateContext