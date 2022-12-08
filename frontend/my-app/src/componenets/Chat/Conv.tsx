import './Chat.scss'

const Conv = (props: { name: string, img_path:string, conv_id:number, setConv:(v:number)=>void, isPrivate:boolean, setIsConvSecret: (v:boolean)=>void}) => {
	const convClicked = (conv_id:number) => {
		props.setConv(conv_id)
		props.setIsConvSecret(props.isPrivate)
	}

	const renderImg = props.img_path ? <img src={props.img_path} alt="pp" /> : <></>

	return <div onClick={() => {convClicked(props.conv_id)}} className="conv">
		{renderImg}
		<p>{props.name}</p>
	</div>
}

export default Conv