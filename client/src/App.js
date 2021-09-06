import React, {useEffect,createContext,useReducer,useContext} from "react"
import Navbar from "./components/Navbar";
import "./App.css";
import {BrowserRouter, Switch, Route, useHistory} from "react-router-dom"
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin"; 
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import CreatPost from "./components/screens/CreatPost";
import {reducer,initialState} from "./reducers/userReducer"

export const UserContext = createContext()

const Routing = () => {
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      history.push('/signin')
    }
  }, [])


  return(
      <Switch>
        <Route exact={true} path="/">
          <Home/>
        </Route>
        <Route path="/signin">
          <Signin/>
        </Route>
        <Route path="/signup">
          <Signup/>
        </Route>
        <Route path="/profile">
          <Profile/>
        </Route>
        <Route path="/create">
          <CreatPost/>
        </Route>
      </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)

  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar/>
        <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
