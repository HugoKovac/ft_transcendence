import { relative } from 'path'
import '../styles/Chat.scss'
 type buttons_states = {
    label : string,
    display : string
 }

const relatives_buttons = (props : {relative_state : string, setRelativeState : (rs : string) => void}, first_state : buttons_states, second_state : buttons_states) : JSX.Element => {
    return <div>
            <button onClick={() => props.setRelativeState(first_state.label)} className="button_relative">{first_state.display}</button>
            <button onClick={() => {props.setRelativeState(second_state.label)}} className="button_relative">{second_state.display}</button>
    </div>
}

const ButtonRelativeState = (props : {relative_state : string, setRelativeState : (rs : string) => void}) => {
    //conditional return in function of what relatives states is show
    if (props.relative_state == "friend")
        return relatives_buttons(props, {label : "remove_friend", display : "Retirer"}, {label : "block_user", display : "Bloquer"})
	else if (props.relative_state == "requested")
    	return relatives_buttons(props, {label : "add_friend", display : "Confirmer ?"}, {label : "block_user", display : "Bloquer"})
	else if (props.relative_state == "send")
    	return relatives_buttons(props, {label : "remove_friend", display : "Envoyé!"}, {label : "block_user", display : "Bloquer"})
    else if (props.relative_state == "blocked")
        return <div><button onClick={() => props.setRelativeState("unblock_user")} className="button_relative">Debloquer</button></div>
	else
    	return relatives_buttons(props, {label : "add_friend", display : "Ajouter"}, {label : "block_user", display : "Bloquer"})
}
export default ButtonRelativeState