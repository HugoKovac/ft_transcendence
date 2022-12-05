import './AdminPanel.scss'

const AdminPanel = () => {
	return <div className="AdminPanel">
		<div className='infoWrap'>
			<form>
				<label htmlFor="changeName">Change Group Name : </label>
				<input type="text" maxLength={35} placeholder='Group Name' id="changeName" />
			</form>
			<form>
				<label htmlFor="isPrivate">Private : </label>
				<input type="checkbox" id="isPrivate" />
			</form>
			<div className='add-users'>
	
			</div>
		</div>
		<button className='save-btn'>Save</button>
	</div>
}

export default AdminPanel