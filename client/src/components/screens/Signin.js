import React, {useState, useContext} from 'react'
import { Link,useHistory } from 'react-router-dom'
import axios from "axios"
import M from "materialize-css"
import { UserContext } from '../../App'

const Signin = () => {
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const postData = (e) =>{
        e.preventDefault();
        
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Enter valid email",classes:"#e53935 red darken-1"})
            return;
        }

        axios.post("/signin",{
            password,
            email
        },
        {
            headers:{
                "Content-Type":"application/json"
            },

        })
        .then(response=>{
            console.log(response.data)
            localStorage.setItem("jwt",response.data.token)
            localStorage.setItem("user",JSON.stringify(response.data.user))
            dispatch({type:"USER",payload:response.data.user})
            M.toast({html: "SignedIn Successfully",classes:"#43a047 green darken-1"})
            history.push('/')
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
                    type="text"
                    name="email"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                />
                <button className="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={(e)=>postData(e)}>
                    Login
                </button>

                <h6>
                    <Link to={"/signup"}>Create an Account</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signin
