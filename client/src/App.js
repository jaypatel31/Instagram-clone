import Navbar from "./components/Navbar";
import "./App.css";
import {BrowserRouter, Switch, Route} from "react-router-dom"
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin"; 
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import CreatPost from "./components/screens/CreatPost";

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
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
    </BrowserRouter>
  );
}

export default App;
