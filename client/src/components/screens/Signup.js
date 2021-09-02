import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="name"
                />
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
                    Signup
                </button>

                <h6>
                    <Link to={"/signin"}>Already have an account?</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signup
