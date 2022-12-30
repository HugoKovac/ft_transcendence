import axios from "axios"
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { toast } from "react-toastify"

type Fight = {
    lobbyID : string,
    username1 : string,
    username2 : string
}

const Party = (props : { username1 : string, username2 : string, lobbyID : string}) : JSX.Element => {
    const url : string = "/game/matchmaking?id=" + props.lobbyID
    return <div>
        <p>{props.username1} VS {props.username2}</p>
        <NavLink to={url}>
            <button>access to the game</button>
        </NavLink>
        </div>
}

const ListParty = () : JSX.Element => {

    const [listParty, setListParty] = useState<JSX.Element[]>([])

    useEffect(() => {
        const axInst = axios.create({
            baseURL: 'http://localhost:3000/api/profile/',
            withCredentials: true
        })

        axInst.post("listParties").then((res) => {
            if (!res.data)
            {
                toast.info("error : no data founded")       
            }
            else
            {
                let list : Fight[] = res.data
                setListParty(list.map((e) => <Party username1={e.username1} username2={e.username2} lobbyID={e.lobbyID}/>))
            }
        })
    }, [])

    return <div>
            {listParty}
        </div>
}

export default ListParty