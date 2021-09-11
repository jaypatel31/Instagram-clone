const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECTRET} = require('../config/keys')



router.post('/signup',(req,res)=>{
    const {name, email, password, pic} = req.body

    if(!email || !password || !name){
        return res.status(422).json({error:"Please add all the field"})
    }
    else{
        User.findOne({email:email})
            .then((savedUser)=>{
                if(savedUser){
                    return res.status(422).json({error:"User already registered"})
                }else{
                    bcrypt.hash(password,12)
                    .then((hashedpassword)=>{
                        const user = new User({
                            email,
                            name,
                            password:hashedpassword,
                            pic
                        })
                        user.save()
                        .then((user)=>{
                            res.status(200).json({message:"User Saved Successfully"})
                        })
                        .catch((e)=>{
                            console.log(e)
                        })
                    })
                    
                }
            })
            .catch(e=>{
                console.log(e);
            })
    }
})

router.post('/signin',(req,res)=>{
    const {email, password} = req.body

    if(!email || !password){
        return res.status(422).json({error:"Please password and email"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // return res.status(200).json({message:"successfully signed in"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECTRET)
                const {_id,name,email, followers, following,pic} = savedUser
                return res.status(200).json({token,message:"successfully signed in",user:{_id,name,email,followers, following,pic}})
            }else{
                return res.status(422).json({error:"Invalid Email or Password"})
            }
        })
        .catch(e=>{
            console.log(e)
        })
    })
    .catch(e=>{
        console.log(e)
    })
})

module.exports = router