import React,{useContext, useEffect,useState} from 'react'
import axios from "axios"
import { UserContext } from '../../App'

const Profile = () => {
    const [profile, setProfile] = useState([])
    const {state, dispatch} = useContext(UserContext)
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
    return (
        <div style={{maxWidth:"650px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid gray"
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
