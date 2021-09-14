const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECTRET,SENDINBLUE_API,EMAIL} = require('../config/keys')
const nodemailer = require('nodemailer');
const sibTransport = require('nodemailer-sendinblue-transport');


const transporter = nodemailer.createTransport(sibTransport({
    apiKey:SENDINBLUE_API
}))


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
                            transporter.sendMail({
                                to:user.email,
                                from:"no-reply@insta.com",
                                subject:"Signup Success",
                                html:"<h1>Welcome to Instagram-clone</h1>"
                            })
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

router.post('/resetpassword',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User doesn't exist with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now()+3600000
            user.save().then(result=>{
                
                transporter.sendMail({
                    to:user.email,
                    from:"no-reply@insta.com",
                    subject:"Password Reset",
                    html:`
                        <p>You requested for password Reset</p>
                        <h5>Click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                    `
                })
            })
            return res.status(200).json({message:"Check your Mail"})
        })
    })
})

router.post('/new-password',(req,res)=>{
    const {password, sentToken} = req.body
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try Again session experied"})
        }
        bcrypt.hash(password,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then(saved=>{
                return res.status(201).json({message:"Password Updated Successfully"})
            })
            
        })
    })
    .catch(err=>{
        console.log(err)
    })
})
module.exports = router