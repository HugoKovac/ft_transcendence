import React from "react"
import ChooseFriend from "./ChooseFriend"
import Popup from "./Popup"

const NewGroupConvBtn = (props: {popup:boolean, setPopup:(v:boolean)=>void, convList:JSX.Element[], nav:number}) => {
	const handlePopup = () =>{
		props.setPopup(true)
	}

	const active = <React.Fragment>
		<button className='btn-pup' onClick={handlePopup}>+ New Conversation</button>
		<Popup trigger={props.popup} setter={{popup: props.popup, setPopup: props.setPopup}}>
			<h1>Choose a friend :</h1>
			<ChooseFriend setPopup={props.setPopup} convList={props.convList}/>
		</Popup>
	</React.Fragment>

	return <React.Fragment>
		{props.nav === 2 ? active : <></>}
	</React.Fragment>
}

export default NewGroupConvBtn