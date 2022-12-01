import '../styles/Chat.scss'

const Conv = (props: { name: string, img_path:string, conv_id:number, setConv:(v:number)=>void}) => {
	const convClicked = (conv_id:number) => {
		props.setConv(conv_id)
	}

	return <div onClick={() => {convClicked(props.conv_id)}} className="conv">
		<img src={props.img_path} alt="pp" />
		<p>{props.name}</p>
	</div>
}

export default Conv