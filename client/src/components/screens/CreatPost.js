import React from 'react'

const CreatPost = () => {
    return (
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
            />
            <input
                type="text"
                name="body"
                placeholder="Body"
            />

            <div className="file-field input-field">
                <div className="btn #1e88e5 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file"/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>

            <button className="btn waves-effect waves-light #1e88e5 blue darken-1">
                Submit Post
            </button>
        </div>
    )
}

export default CreatPost
