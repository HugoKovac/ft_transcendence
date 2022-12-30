import ListParty from "../componenets/ListParty";
import NavBar from "../componenets/NavBar";

const Parties = () : JSX.Element => {
    return <div>
        <NavBar/>
        <h1>Current Parties :</h1> 
        <ListParty/>
    </div>
}


export default Parties