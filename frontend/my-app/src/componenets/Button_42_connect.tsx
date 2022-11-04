import "../styles/Button_42_connect.css"

const Button_42_Connect = () => {
	return (
		<div className="back-button">
			<a href="http://localhost:3000/api/auth/" className="ancr-button">
				<table>
					<tr className="tr-button">
						<td><img src="./logo-42(1).png" alt="42 logo" className="img-btn" /></td>
						<td><h2 className="text-button">42 Connect</h2></td>
					</tr>
				</table>
			</a>
		</div>
	)
}

export default Button_42_Connect