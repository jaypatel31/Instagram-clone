import React,{useContext, useEffect,useState} from 'react'
import axios from "axios"
import { UserContext } from '../../App'
import M from "materialize-css"

const Profile = () => {
    const [profile, setProfile] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(() => {
        axios.get("/mypost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(response=>{
            console.log(response.data.myposts)
            setProfile(response.data.myposts)
        })
        .catch(e=>{
            console.log(e)
        })
    }, [])

    useEffect(() => {
        if(image){
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
                
                // 
                // dispatch({type:"UPDATEPIC",payload:data.url})
                axios.put("/updatepic",{
                    pic:data.url
                },{
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    }
                })
                .then(response=>{
                    console.log(response.data)
                    localStorage.setItem("user",JSON.stringify({...state,pic:response.data.pic}))
                    dispatch({type:"UPDATEPIC",payload:response.data.pic})
                    M.toast({html: "Profile Pic Updated",classes:"#43a047 green darken-1"})
                })
                .catch(e=>{
                    console.log(e)
                })
            })
            .catch(e=>{
                console.log(e)
            })
        }
    }, [image])

    const updatePic =(file) =>{
        setImage(file)
    }

    return (
        <div style={{maxWidth:"650px",margin:"0px auto"}}>
            <div style={{
                     margin:"18px 0px",
                    borderBottom:"1px solid gray"
                }}>
                <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                }}>
                    <div>
                        <img style={{width:"160px",height:"160px",borderRadius:"50%"}} src={state?state.pic:""} alt="Person"/>
                        
                    </div>
                    <div>
                        <h4>{state?state.name:"Loading"}</h4>
                        <h5>{state?state.email:"Loading"}</h5>
                        <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                            <h6>{profile.length} post</h6>
                            <h6>{state?state.followers.length:"0"} follower</h6>
                            <h6>{state?state.following.length:"0"} following</h6>
                        </div>
                    </div>
                </div> 

                <div className="file-field input-field" style={{margin:"10px"}}>
                    <div className="btn #1e88e5 blue darken-1">
                        <span>Update Pic</span>
                        <input 
                            type="file"
                            onChange={(e)=>updatePic(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    profile.map((pic,index)=>{
                        return(
                            <img key={index} className="item" src={pic.photo} alt=""/>
                        )
                    })
                }
                
                
            </div>
            
        </div>
    )
}

export default Profile
