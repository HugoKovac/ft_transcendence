import "../styles/Button_42_connect.css"
import { useContext } from "react"
import LoginStateContext from "./LoginStateContext"

const Button42Connect = () => {
	return (
		<div className="back-button">
			<a href="http://localhost:3000/api/auth/" className="ancr-button">
				<table>
					<tbody>
						<tr className="tr-button">
							<td><img src="./logo-42-100x70.png" alt="42 logo" className="img-btn" /></td>
							<td><h2 className="text-button">42 Connect</h2></td>
						</tr>
					</tbody>
				</table>
			</a>
		</div>
	)
}

export default Button42Connect