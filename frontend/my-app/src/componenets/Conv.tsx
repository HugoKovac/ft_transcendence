import '../styles/Chat.scss'

const Conv = (props: {name: string, img_path:string}) => {
	return <div className="conv">
		<img src={props.img_path} alt="pp" />
		<p>{props.name}</p>
	</div>
}

export default Conv