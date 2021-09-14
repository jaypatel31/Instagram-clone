import React,{useContext,useEffect,useRef,useState} from 'react'
import {Link, useHistory} from "react-router-dom"
import { UserContext } from '../App'
import M from 'materialize-css'
import axios from 'axios'

const Navbar = () => {
    const searchModal = useRef(null)
    const [search, setSearch] = useState("")
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)
    const [userData,setUserData] = useState([])

    useEffect(() => {
        M.Modal.init(searchModal.current);
    }, [])

    const renderList = () =>{
      
      if(state){
        return [
          <li key={1}><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black",cursor:"pointer"}}>search</i></li>,
          <li key={2}><Link to={"/profile"}>Profile</Link></li>,
          <li key={3}><Link to={"/create"}>Create Post</Link></li>,
          <li key={4}><Link to={"/myfollowingpost"}>My Following Posts</Link></li>,
          <li>
            <button className="btn waves-effect waves-light #e53935 red darken-1" onClick={(e)=>{
              localStorage.clear()
              dispatch({type:"CLEAR"})
              history.push("/signin")
            }}>
                Logout
            </button>
          </li>
        ]
      }else{
        return[
          <li key={5}><Link to={"/signin"}>Signin</Link></li>,
          <li key={6}><Link to={"/signup"}>Signup</Link></li>
        ]
      }
    } 

    const fetchUsers = (query) =>{
      setSearch(query)
      axios.post('/search-users',{
          pattern:query
        },
        {
          headers:{
            "Content-Type":"application/json"
        }
      })
      .then(response=>{
        setUserData(response.data.user)
      })
      .catch(error=>{
        console.log(error)
      })
    }
    return (
      <>
        <nav>
        <div className="nav-wrapper white">
          <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
          <a href="#" data-target="mobile-demo" className="sidenav-trigger right"><i className="material-icons">menu</i></a>
          <ul id="nav-mobile" className="right hide-on-med-and-down ">
            {renderList()}
          </ul>
        </div>
        <div id="modal1" className="modal" ref={searchModal} >
          <div className="modal-content" style={{color:"black"}}>
          <input
                    type="text"
                    name="email"
                    placeholder="Search Users"
                    value={search}
                    onChange={(e)=>{fetchUsers(e.target.value)}}
                />
          
          
          <div className="collection">
            {
              userData.map((user,index)=>{
                return(
                  <Link to={user._id!==state._id?"/profile/"+user._id:"/profile"} key={index} className="collection-item" onClick={()=>{
                    M.Modal.getInstance(searchModal.current).close()
                    setSearch("")
                  }}>{user.email}</Link>
                )
              })
            }
          </div>
          </div>
          
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearch("")}}>Close</button>
          </div>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo">
        {renderList()}
      </ul>
       </>     
    )
}

export default Navbar
