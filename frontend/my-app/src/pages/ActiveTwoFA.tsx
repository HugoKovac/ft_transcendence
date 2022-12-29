import axios from "axios"
import React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

const Active2FA = () => {
	const [qrcode, setQrcode] = useState('')

	useEffect(() => {
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/auth',
			withCredentials: true,
		})

		axInst.get('qrcode').then((res) => {
			setQrcode(res.data)
		}).catch((e) => {
			console.error(e)
		})
	}, [])

	const nav = useNavigate()

	const activeInBack = () => {
		const axInst = axios.create({
			baseURL: 'http://localhost:3000/api/auth',
			withCredentials: true,
		})

		axInst.post('active2fa').then((res) => {
			nav('/')
		}).catch((e) => {
			console.error(e)
		})
	}

	return <React.Fragment>
		<h1>Scan the qrcode to get the 2FA codes</h1>
		<img src={qrcode} alt="qrcode" />
		<button onClick={activeInBack}>Got it</button>
	</React.Fragment>
}

export default Active2FA