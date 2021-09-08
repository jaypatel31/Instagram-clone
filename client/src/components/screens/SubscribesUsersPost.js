import React,{useState,useEffect, useContext} from 'react'
import axios from 'axios'
import { UserContext } from '../../App'
import M from "materialize-css"
import { Link } from 'react-router-dom'

const SubscibesUsersPost = () => {
    const [data, setData] = useState([])
    const {state,dispatch} = useContext(UserContext)

    useEffect(() => {
        axios.get("/getsubpost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(response=>{
            console.log(response.data.posts)
            setData(response.data.posts)
        })
        .catch(e=>{
            console.log(e)
        })
    }, [])

    const likePost = (id)=>{
        axios.put("/like",{
            postId:id
        },{
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(response=>{
            const newData = data.map(item=>{
                if(item._id===response.data._id){
                    return response.data
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(e=>{
            console.log(e)
        })
    }

    const unlikePost = (id)=>{
        axios.put("/unlike",{
            postId:id
        },{
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(response=>{
            const newData = data.map(item=>{
                if(item._id===response.data._id){
                    return response.data
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(e=>{
            console.log(e)
        })
    }

    const makeComment = (text,postId)=>{
        axios.put("/comment",{
            text,
            postId
        },{
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(response=>{
            console.log(response)
            M.toast({html: "Post Deleted Successfully",classes:"#43a047 green darken-1"})
            const newData = data.map(item=>{
                if(item._id===response.data._id){
                    return response.data
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(e=>{
            console.log(e)
        })
    }

    const deletePost = (postId) =>{
        axios.delete(`/deletepost/${postId}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(response=>{
            console.log(response.data)
            const newData = data.filter(item=>{
                return item._id !== response.data._id
            })
            setData(newData)
        })
        .catch(e=>{
            console.log(e)
        })
    }

    const deleteComment = (postId,commentId)=>{
        axios.put("/deletecomment",{
            commentId,
            postId
        },{
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(response=>{
            const newData = data.map(item=>{
                if(item._id===response.data._id){
                    return response.data
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(e=>{
            console.log(e)
        })
    }

    return (
        <div className="home">
            {
                state.following.length>0?
                data.length>0?
                data.map((item,index)=>{
                    return(
                        <div className="card home-card" key={index}>
                            <h5 style={{padding:"5px"}}>
                                <Link to={state._id!==item.postedBy._id?`/profile/${item.postedBy._id}`:"/profile"}>{item.postedBy.name}</Link>
                                
                                {
                                    (state._id===item.postedBy._id)?<i className="material-icons" style={{cursor:"Pointer",color:"red",float:"right"}} onClick={(e)=>{deletePost(item._id)}}>delete</i>:""
                                }

                            </h5>
                            <div className="card-image">
                                <img src={item.photo} alt=""/>
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{color:"red"}}>favorite</i>
                                {item.likes.includes(state._id)?<i className="material-icons" style={{cursor:"Pointer"}} onClick={(e)=>{unlikePost(item._id)}}>thumb_down</i>:<i className="material-icons" style={{cursor:"Pointer"}} onClick={(e)=>{likePost(item._id)}}>thumb_up</i>}
                                
                                
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map((comment,index)=>{
                                        return(
                                            <h6 key={index}><span style={{fontWeight:"500"}}>{comment.postedBy.name}</span> {comment.text} {
                                                (state._id===comment.postedBy._id)?<i className="material-icons" style={{cursor:"Pointer",color:"red",float:"right"}} onClick={(e)=>{deleteComment(item._id,comment._id)}}>delete</i>:""
                                            }</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    
                                    makeComment(e.target[0].value,item._id);
                                    e.target[0].value ="";
                                }}>
                                    <input
                                        type="text"
                                        name="comment"
                                        placeholder="add a comment"
                                    />
                                </form>
                            </div>
                        </div>
                    )
                }):
                <h2 style={{textAlign:"center"}}>Loading</h2>:
                <h2 style={{textAlign:"center"}}>Not Following anyone</h2>
            }

            

        </div>
    )
}

export default SubscibesUsersPost
