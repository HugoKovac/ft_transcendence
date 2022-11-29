import '../styles/Chat.scss'

const Conv = (props: { name: string, img_path:string, user_id_2:number, setConv:(v:number)=>void}) => {
	const convClicked = (user_id_2:number) => {
		props.setConv(user_id_2)
	}

	return <div onClick={() => {convClicked(props.user_id_2)}} className="conv">
		<img src={props.img_path} alt="pp" />
		<p>{props.name}</p>
	</div>
}

export default Conv