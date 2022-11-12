import { createContext, useState, useEffect } from "react"

type ObjLoginStateContext = {
	logState: boolean
	setLogState: (state: boolean) => void
}

export const LoginStateContext = createContext<ObjLoginStateContext>({
	logState: false,
	setLogState: () => {}
})

export const LoginStateProvider = ({children}:any) => {

	const stored = localStorage.getItem('jwt')
	const parseStored:boolean = stored ? JSON.parse(stored) : false

	const [logState, setLogState] = useState<boolean>(parseStored)

	useEffect(() =>{
		console.log('test')
		localStorage.setItem('jwt', JSON.stringify(logState))
	}, [logState])

	return (
		<LoginStateContext.Provider value={{ logState, setLogState }}>
			{children}
		</LoginStateContext.Provider>
	)
}

export default LoginStateContext