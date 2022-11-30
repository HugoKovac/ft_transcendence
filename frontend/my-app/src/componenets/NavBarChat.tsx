const NavBarChat = (props: {nav:number, convMode: ()=>void, groupMode: ()=>void}) => {
	return <div className='navBarSide'>
		<button onClick={props.convMode} className={props.nav === 1 ? 'btn-group active' : 'btn-group'}>Conversation</button>
		<button onClick={props.groupMode} className={props.nav === 2 ? 'btn-group active' : 'btn-group'}>Group</button>
	</div>
}

export default NavBarChat