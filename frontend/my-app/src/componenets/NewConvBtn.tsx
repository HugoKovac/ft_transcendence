import React from "react"
import ChooseFriend from "./ChooseFriend"
import CreateGroupPopup from "./CreateGroupPopup"
import Popup from "./Popup"

const NewConvBtn = (props: {popup:boolean, setPopup:(v:boolean)=>void, convList:JSX.Element[], nav:number}) => {
	const handlePopup = () =>{
		props.setPopup(true)
	}
	const btnContent: string = props.nav === 1 ? '+ New Conversation' : '+ New Group'
	const content: string = props.nav === 1 ? 'Choose a friend :' : 'Create a group :'
	const popup: JSX.Element = props.nav === 1 ? <ChooseFriend setPopup={props.setPopup} convList={props.convList}/> : <CreateGroupPopup />

	const active = <React.Fragment>
		<button className='btn-pup' onClick={handlePopup}>{btnContent}</button>
		<Popup trigger={props.popup} setter={{popup: props.popup, setPopup: props.setPopup}}>
			<h1>{content}</h1>
			{popup}
		</Popup>
	</React.Fragment>

	return <React.Fragment>
		{active}
	</React.Fragment>
}

export default NewConvBtn