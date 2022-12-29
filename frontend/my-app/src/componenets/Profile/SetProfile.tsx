import LoginStateContext from "./../Login/LoginStateContext"
import { useContext, useState, useEffect} from 'react'
import { userProto } from "./Profile"
import axios from "axios"
import { NavLink } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';




const SetProfile = () : JSX.Element => {
    const [newUsername, setNewUsername] = useState<string>("")
	const [newPp, setNewPp] = useState<any>(null)
	const [dataUser, setDataUser] = useState<userProto | 'loading' | undefined>("loading")
	const {logState} = useContext(LoginStateContext)
    let buffUN : string = ""

    async function get_data_user () : Promise<void>
	{
		if (dataUser !== undefined && dataUser !== 'loading')
			return
		const req_base = axios.create({ baseURL: 'http://localhost:3000/api/profile/', withCredentials: true})
		req_base.post("getUserData", {user_id : logState, target_id : logState}).then((res) => {
			console.log(JSON.stringify(res.data, null, 2))
			let buffProto : userProto | undefined = res.data
			if (buffProto?.pp && buffProto.pp.startsWith('localhost:3000/profile-pictures/'))
				buffProto.pp = 'http://' + buffProto.pp
			if (buffProto?.id)
            {
				setDataUser(buffProto)
            }
			else
				setDataUser(undefined)
		}).catch((e) => console.log(e))
    }

    useEffect(() => {
        if (newUsername === "")
            return 
		const req_base = axios.create({ baseURL: 'http://localhost:3000/api/profile/', withCredentials: true})
		req_base.post("setUsername", {user_id : logState, username : newUsername}).then((res) => {
			console.log("from change username : " + JSON.stringify(res))
            toast(res.data)
			setDataUser("loading")
		}).catch((e) => console.log(e))

    }, [newUsername])

	function setPp () {
		if (newPp)
		{
			const req_base = axios.create({
				baseURL: 'http://localhost:3000/api/profile/',
				withCredentials: true
			})
			const formData = new FormData();
    		formData.append('file',newPp)
			req_base.post("uploadPp", formData, {headers : { "Content-Type": "multipart/form-data" }}).then((res) => {
				console.log(res)
                toast(res.data)
				setDataUser("loading")
			}).catch((e) => console.log(e.response))
		}
	}
	function delPp() {
			const req_base = axios.create({
				baseURL: 'http://localhost:3000/api/profile/',
				withCredentials: true,
			})
			req_base.post("delPp", {user_id : logState}).then((res) => {
				console.log(res)
                toast(res.data)
				setDataUser("loading")
			}).catch((e) => console.log(e))
		}

    if (dataUser === 'loading')
        get_data_user()
    if (dataUser === 'loading')
	    return <div className="load"><p>Loading</p></div>
    let path : JSX.Element = <img className="ppUser" src={ dataUser?.pp ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0D8RJLIfGu9BfAEv3oMYyxiGfkGsGABeSsY6K2Ugy&s"}/>
    return (<div className="decideSettings">
            <h1>Edit your profile : </h1>
        	<div className="pp">
			{path}
			<div className="buttonModif">
					<input type="file"
					      id="profile_pic"
						  name="profile_pic"
						  accept=".jpg, .jpeg, .png"
						  onChange={(e) => {
							if (e.target.files)
								setNewPp(e.target.files[0])
						  }
						  }/>
				<button onClick={setPp}>
					change profile picture
				</button>
				<button onClick={delPp}>
					delete profile picture
				</button>
			</div>
		</div>
		<div className="nameUser">
			<p className="name">Name : {dataUser?.username}</p>
			<div className="buttonModif">
				<input type="text" placeholder="Bob" onChange={(e) => buffUN = e.target.value}/>
				<button onClick={() =>{
                    if (buffUN !== "")
                        setNewUsername(buffUN)
                } }>
					change username
				</button>
			</div>
            <ToastContainer />
            <NavLink to="/" onClick={(e) => {
                if (dataUser?.username === "")
                    e.preventDefault()  
            }} className={(nav) : any => (nav.isActive ? "ancr nav-active" : "ancr")}>
				<button className="buttonProps">Save settings</button>
		</NavLink>
		</div>

    </div>)
}

export default SetProfile