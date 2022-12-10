import '../styles/Chat.scss'
import {ButtonRelativeState} from "./ButtonRelativeState"

const LineUser = (props : {name : string, img_path: string, relative_state : string, setRelativeState : (rs : string) => void}) => {
	const renderImg = props.img_path ? <img src={props.img_path} alt="pp" /> : <></>
    //will redirect to the profile onclick
    return <div onClick={() => {}}>
        {renderImg}
        <p>{props.name}</p>
        <ButtonRelativeState relative_state={props.relative_state} setRelativeState={props.setRelativeState} />
        </div>
}

export default LineUser