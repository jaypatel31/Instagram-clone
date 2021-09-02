import React from 'react'
import {Link} from "react-router-dom"

const Signin = () => {
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input
                    type="text"
                    name="email"
                    placeholder="email"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                />
                <button className="btn waves-effect waves-light #1e88e5 blue darken-1">
                    Login
                </button>

                <h6>
                    <Link to={"/signup"}>Create an Account</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signin
