import React,{useState,useEffect, useContext} from 'react'
import axios from 'axios'
import { UserContext } from '../../App'
import M from "materialize-css"
import { Link } from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    useEffect(() => {
        axios.get("/allpost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(response=>{
            console.log(response.data.posts)
            setData(response.data.posts)
            var elems = document.querySelectorAll('.modal');
            var instances = M.Modal.init(elems);
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
            M.toast({html: "Comment Added Successfully",classes:"#43a047 green darken-1"})
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
                return item._id.toString() !== response.data.result._id.toString()
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

    const setValue = (postId) =>{
        data.map(item=>{
            if(item._id === postId){
                setTitle(item.title)
                setBody(item.body)
                setImage(item.photo)
                setUrl(item.photo)
            }
        })
    }

    const updatePost = (postId,url) =>{
        axios.put("/updatepost",{
            postId,
            title,
            body,
            pic:url
        },
        {
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },

        })
        .then(response=>{
            console.log(response.data)
            M.toast({html: "Updated Post Successfully",classes:"#43a047 green darken-1"})
            let newData = data.map(item=>{
                if(item._id===response.data._id){
                    return response.data
                }
                return item;
            })
            setData(newData)

        })
        .catch(e=>{
            M.toast({html: e.response.data.error,classes:"#e53935 red darken-1"})
            console.log(e.response.data)
        })
    }

    const editPost = (postId)=>{
        if(typeof(image) !== "object"){
            updatePost(postId,url)
        }
        else{
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
                updatePost(postId,data.url);
            })
            .catch(e=>{
                console.log(e)
            })
        }
        
    }

    const editComment = (postId,commentId)=>{
        document.getElementById(commentId).contentEditable = true;
        document.getElementById(commentId).focus();
        document.getElementById(commentId).classList.add('editing');
    }

    const blurHandler = (postId,commentId)=>{
        if(document.getElementById(commentId).contentEditable){
            let val = document.getElementById(commentId).innerText
            console.log(val);
            if(val.trim()!==""){
                document.getElementById(commentId).contentEditable = false;
                document.getElementById(commentId).classList.remove('editing');
                updateComment(postId,commentId);
            }else{
                M.toast({html: "Can't post empty comment",classes:"#e53935 red darken-1"})
                data.map(item=>{
                    if(item._id==postId){
                        item.comments.map(comment=>{
                            if(comment._id == commentId){
                                document.getElementById(commentId).innerText = comment.text
                            }
                        }) 
                    }
                })
                document.getElementById(commentId).contentEditable = false;
                document.getElementById(commentId).classList.remove('editing');
            }
            
        }
        
    }

    const updateComment = (postId,commentId)=>{
        let text = document.getElementById(commentId).innerText
        axios.put("/updatecomment",{
            text,
            postId,
            commentId
        },{
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(response=>{
            console.log(response)
            M.toast({html: "Comment Updated Successfully",classes:"#43a047 green darken-1"})
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

    const changeDetection = (event,postId,commentId) =>{
        if(event.keyCode === 13 || event.keyCode === 9){
            let val = document.getElementById(commentId).innerText
                document.getElementById(commentId).innerText = val.trim();
                document.getElementById(commentId).blur();
        }
    }
    return (
        <div className="home">

        
            {
                data.map((item,index)=>{
                    return(
                        <div className="card home-card" key={index}>
                            <h5 style={{padding:"5px"}}>
                                <Link to={state._id!==item.postedBy._id?`/profile/${item.postedBy._id}`:"/profile"}>{item.postedBy.name}</Link>
                                
                                {
                                    (state._id===item.postedBy._id)?<i className="material-icons" style={{cursor:"Pointer",color:"red",float:"right"}} onClick={(e)=>{deletePost(item._id)}}>delete</i>:""
                                }

                                {
                                    (state._id===item.postedBy._id)?  <a className="modal-trigger" style={{float:'right'}} onClick={()=>{setValue(item._id)}} href={`#${item._id}`}><i className="material-icons" style={{cursor:"Pointer",color:"blue"}}>edit</i></a>:""
                                }
                            </h5>
                            <div id={item._id} className="modal">
                                <h4>Update Post</h4>
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
                                            <input className="file-path validate" type="text" value={item.photo} onChange={(e)=>{console.log(e.target.value)}}/>
                                        </div>
                                    </div>
                                    <div style={{display:'flex',justifyContent:"space-around"}}>
                                        <a href="#!" className="modal-close btn #1e88e5 blue darken-1" style={{color:"white !important"}}>Cancel</a>

                                        <a href="#!" className="modal-close btn #1e88e5 blue darken-1" style={{color:"white !important"}} onClick={(e)=>editPost(item._id)}>Update Post</a>
                                    </div>
                                </div>
                               
                            </div>
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
                                            <h6 key={index}><span style={{fontWeight:"500",verticalAlign:"top"}}>{comment.postedBy.name}</span> <span className="comment" onKeyUp={(e)=>{changeDetection(e,item._id,comment._id)}} onBlur={()=>blurHandler(item._id,comment._id)} id={comment._id}>{comment.text}</span> {
                                                (state._id===comment.postedBy._id)?<><i className="material-icons" style={{cursor:"Pointer",color:"blue",float:"right"}} onClick={(e)=>{editComment(item._id,comment._id)}}>edit</i><i className="material-icons" style={{cursor:"Pointer",color:"red",float:"right"}} onClick={(e)=>{deleteComment(item._id,comment._id)}}>delete</i></>:""
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
                })
            }

            

        </div>
    )
}

export default Home
