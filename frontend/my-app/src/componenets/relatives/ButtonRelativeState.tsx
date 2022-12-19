import { relative } from 'path'
import "./relatives.scss"
 type buttons_states = {
    label : string,
    display : string
 }

const relatives_buttons = (props : {relative_state : string, setRelativeReqState : (nr : string) => void}, first_state : buttons_states, second_state : buttons_states)  => {
    return <div className='divButtons'>
            <button onClick={() => props.setRelativeReqState(first_state.label)} className="button_relative">{first_state.display}</button>
            <button onClick={() => {props.setRelativeReqState(second_state.label)}} className="button_relative">{second_state.display}</button>
    </div>
}

const ButtonRelativeState = (props : {relative_state : string, setRelativeReqState : (nr : string) => void}) : JSX.Element => {
    //conditional return in function of what relatives states is show
    if (props.relative_state == "friend")
        return relatives_buttons(props, {label : "remove_friend", display : "Retirer"}, {label : "block_user", display : "Bloquer"})
	else if (props.relative_state == "recv")
    	return relatives_buttons(props, {label : "add_friend", display : "Confirmer ?"}, {label : "block_user", display : "Bloquer"})
	else if (props.relative_state == "send")
    	return relatives_buttons(props, {label : "remove_friend", display : "Envoyé!"}, {label : "block_user", display : "Bloquer"})
    else if (props.relative_state == "blocked")
        return <div className='divButtons'><button onClick={() => props.setRelativeReqState("unblock_user")} className="button_relative">Debloquer</button></div>
	else
    	return relatives_buttons(props, {label : "add_friend", display : "Ajouter"}, {label : "block_user", display : "Bloquer"})
}
export default ButtonRelativeState