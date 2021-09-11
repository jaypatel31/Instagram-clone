import React, {useState, useEffect} from 'react'
import { Link,useHistory } from 'react-router-dom'
import axios from "axios"
import M from "materialize-css"

const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(()=>{
        if(url){
            uploadFields()
        }
        
    },[url])

    const uploadPic = () =>{
        const data = new FormData()
        data.append('file',image)
        data.append('upload_preset',"insta-clone")
        data.append("cloud_name","instagram-clone31")
        
        fetch("https://api.cloudinary.com/v1_1/instagram-clone31/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url);
        })
        .catch(e=>{
            console.log(e)
        })
    }

    const uploadFields = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Enter valid email",classes:"#e53935 red darken-1"})
            return;
        }

        axios.post("/signup",{
            name,
            password,
            email,
            pic:url
        },
        {
            headers:{
                "Content-Type":"application/json"
            },

        })
        .then(response=>{
            M.toast({html: response.data.message,classes:"#43a047 green darken-1"})
            history.push('/signin')
        })
        .catch(e=>{
            M.toast({html: e.response.data.error,classes:"#e53935 red darken-1"})
            console.log(e.response.data)
        })
    }

    const postData = (e) =>{
        e.preventDefault();
        
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }

        
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="name"
                    value={name}
                    onChange={(e)=>{setName(e.target.value)}}
                />
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
                <div className="file-field input-field">
                    <div className="btn #1e88e5 blue darken-1">
                        <span>Upload Pic</span>
                        <input 
                            type="file"
                            onChange={(e)=>setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={(e)=>postData(e)}>
                    Signup
                </button>

                <h6>
                    <Link to={"/signin"}>Already have an account?</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signup
