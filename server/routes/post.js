const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin')

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body} = req.body

    if(!title || !body){
        return res.status(422).json({error:"Please add all fields"})
    }
    req.user.password = undefined

    const post = new Post({
        title,
        body,
        postedBy:req.user
    })

    post.save().then(result=>{
        return res.status(200).json({post:result})
    })
    .catch(e=>{
        console.log(e)
    })
})

module.exports = router