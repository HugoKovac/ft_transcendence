import axios from "axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const Verify_2fa = () => {//if return of verify navigate to check_token
	const nav = useNavigate()
	const [code, setCode] = useState('')
	
	const verify = (e:any) => {
		e.preventDefault()
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/auth',
			withCredentials: true,
		})
		
		if (code.length){
			axInst.post('verify2fa', {code: code}).then((res) => {
				console.log(res.data)
				if(res.data === true)
					nav('/redirect/check_token')
				else if (res.data === false)
					setCode('')
			}).catch((e) => {
				console.error(e)
			})
		}
	}

	
	return <React.Fragment>
		<h1>Enter your 2FA code</h1>
		<form onSubmit={verify}>
			<label>Code : </label>
			<input autoComplete="off" value={code} onChange={(v) => {setCode(v.target.value)}} type="text" />
			<button>Verify</button>
		</form>
	</React.Fragment>
}

export default Verify_2fa