import './Chat.scss'
import Parsepp from '../imgParse'

const Conv = (props: { name: string, img_path:string, conv_id:number, setConv:(v:number)=>void, isPrivate:boolean, setisConvPrivate: (v:boolean)=>void}) => {
	const convClicked = (conv_id:number) => {
		props.setConv(conv_id)
		props.setisConvPrivate(props.isPrivate)
	}

	const renderImg = props.img_path ? <img src={Parsepp(props.img_path)} alt="pp" /> : <></>

	return <div onClick={() => {convClicked(props.conv_id)}} className="conv">
		{renderImg}
		<p>{props.name}</p>
	</div>
}

export default Conv