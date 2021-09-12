import React,{useContext,useEffect} from 'react'
import {Link, useHistory} from "react-router-dom"
import { UserContext } from '../App'
import {M }from 'materialize-css'

const Navbar = () => {
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)

    const renderList = () =>{
      
      if(state){
        return [
          <li><Link to={"/profile"}>Profile</Link></li>,
          <li><Link to={"/create"}>Create Post</Link></li>,
          <li><Link to={"/myfollowingpost"}>My Following Posts</Link></li>,
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
          <li><Link to={"/signin"}>Signin</Link></li>,
          <li><Link to={"/signup"}>Signup</Link></li>
        ]
      }
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
      </nav>

      <ul className="sidenav" id="mobile-demo">
        {renderList()}
      </ul>
       </>     
    )
}

export default Navbar
