import React from "react"
import ChooseFriend from "./ChooseFriend"
import Popup from "./Popup"

const NewConvBtn = (props: {popup:boolean, setPopup:(v:boolean)=>void, convList:JSX.Element[], handlePopup:()=>void}) => {
	return <React.Fragment>
		<button className='btn-pup' onClick={props.handlePopup}>+ New Conversation</button>
		<Popup trigger={props.popup} setter={{popup: props.popup, setPopup: props.setPopup}}>
			<h1>Choose a friend :</h1>
			<ChooseFriend setPopup={props.setPopup} convList={props.convList}/>
		</Popup>
	</React.Fragment>
}

export default NewConvBtn