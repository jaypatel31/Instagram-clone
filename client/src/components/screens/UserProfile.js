import React,{useContext, useEffect,useState} from 'react'
import axios from "axios"
import { UserContext } from '../../App'
import { useParams } from 'react-router'

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null)
    const [showFollow, setShowFollow] = useState(true)
    const {state, dispatch} = useContext(UserContext)
    const {userId} = useParams()
    useEffect(() => {
        axios.get(`/user/${userId}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(response=>{
            console.log(response.data)
            setUserProfile(response.data)
        })
        .catch(e=>{
            console.log(e)
        })
    }, [])

    const unfollowUser = ()=>{
        axios.put("/unfollow",{
            unfollowId:userId
        },{
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(response=>{
            
            console.log(response.data)
            dispatch({type:"UPDATE",payload:{following:response.data.following,followers:response.data.followers}})
            localStorage.setItem("user",JSON.stringify(response.data))
            
            setUserProfile(prevState=>{
                const newFollower = prevState.user.followers.filter(item=> item!==response.data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true)
        })
        .catch(e=>{
            console.log(e)
        })
    }

    const followUser = ()=>{
        axios.put("/follow",{
            followId:userId
        },{
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(response=>{
            
            console.log(response.data)
            dispatch({type:"UPDATE",payload:{following:response.data.following,followers:response.data.followers}})
            localStorage.setItem("user",JSON.stringify(response.data))
            setUserProfile(prevState=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,response.data._id]
                    }
                }
            })
            setShowFollow(false)
        })
        .catch(e=>{
            console.log(e)
        })
    }

    return (
        <>
        {
            userProfile? 
            <div style={{maxWidth:"650px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid gray"
            }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"50%"}} src="https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8MnwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Person"/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{userProfile.posts.length} post</h6>
                        <h6>{userProfile.user.followers.length} follower</h6>
                        <h6>{userProfile.user.following.length} following</h6>
                    </div>
                    {
                        showFollow?
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={(e)=>followUser()}>
                            Follow
                        </button>:
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #1e88e5 blue darken-1" onClick={(e)=>unfollowUser()}>
                            Unfollow
                        </button>
                    }
                    
                    
                </div>
            </div> 
        
            <div className="gallery">
                {
                    userProfile.posts.map((pic,index)=>{
                        return(
                            <img key={index} className="item" src={pic.photo} alt=""/>
                        )
                    })
                }
                
                
            </div>
            
        </div>
            
            
            :<h2>Loading...</h2>
        }
        
        </>
    )
}

export default UserProfile
