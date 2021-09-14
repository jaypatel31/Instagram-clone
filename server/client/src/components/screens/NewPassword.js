import React, {useState, useContext,useEffect} from 'react'
import { Link,useHistory,useParams } from 'react-router-dom'
import axios from "axios"
import M from "materialize-css"
import { UserContext } from '../../App'

const NewPassword = () => {
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password, setPassword] = useState("")
    const {token} = useParams()

    const postData = (e) =>{
        e.preventDefault();

        axios.post("/new-password",{
            password,
            sentToken:token
        },
        {
            headers:{
                "Content-Type":"application/json"
            },

        })
        .then(response=>{
            M.toast({html:response.data.message,classes:"#43a047 green darken-1"})
            history.push('/signin')
        })
        .catch(e=>{
            M.toast({html: e.response.data.error,classes:"#e53935 red darken-1"})
            console.log(e.response.data)
        })
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                />
                <button className="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={(e)=>postData(e)}>
                    Reset
                </button>

            </div>
        </div>
    )
}

export default NewPassword
