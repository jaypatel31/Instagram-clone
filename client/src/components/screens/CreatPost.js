import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'
import axios from "axios"
import M from "materialize-css"

const CreatPost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    const postDetails = (e) =>{
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

        axios.post("/createpost",{
            title,
            body,
            url
        },
        {
            headers:{
                "Content-Type":"application/json"
            },

        })
        .then(response=>{
            console.log(response.data)
            M.toast({html: "Created Post Successfully",classes:"#43a047 green darken-1"})
            history.push('/')
        })
        .catch(e=>{
            M.toast({html: e.response.data.error,classes:"#e53935 red darken-1"})
            console.log(e.response.data)
        })
    }

    return (
        <div className="card input-field" style={{
            margin:"30px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />
            <input
                type="text"
                name="body"
                placeholder="Body"
                value={body}
                onChange={(e)=>setBody(e.target.value)}
            />

            <div className="file-field input-field">
                <div className="btn #1e88e5 blue darken-1">
                    <span>Upload Image</span>
                    <input 
                        type="file"
                        onChange={(e)=>setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>

            <button className="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={(e)=>postDetails(e)}>
                Submit Post
            </button>
        </div>
    )
}

export default CreatPost
