import { PropsWithChildren } from 'react'
import '../styles/Popup.scss'

const Popup = (props: PropsWithChildren<{trigger:boolean, setter:{popup:boolean, setPopup:(state: boolean)=>void}}>) => {
	const handleClose = () =>{
		props.setter.setPopup(false)
	}
	
	return props.trigger ?
	<div className='popup'>
		<div className='popup-content'>
			<button className='close-btn' onClick={handleClose}>X</button>
			{props.children}
		</div>
	</div> 
	: <></>
}

export default Popup