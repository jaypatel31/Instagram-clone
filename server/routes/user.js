const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin')
const ObjectId = require('mongoose').Types.ObjectId;
const User = mongoose.model("User")

router.get("/user/:id",requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.status(200).json({user,posts})
        })
    })
    .catch(e=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.put("/follow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    })
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true
        })
        .select("-password")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.status(201).json(result)
        })
    })
})

router.put("/unfollow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    })
    .exec((err,result1)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true
        })
        .select("-password")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.status(201).json(result)
        })
    })
})

router.put("/updatepic",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{pic:req.body.pic}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        return res.status(201).json(result)
    })
})

router.put("/updatedetails",requireLogin,(req,res)=>{
    const {name,email} = req.body
    if(email !== req.user.email){
        User.findOne({email:email})
        .then((savedUser)=>{
            if(savedUser){
                return res.status(422).json({error:"Email already registered"})
            }else{
                User.findByIdAndUpdate(req.user._id,{
                    $set:{name,email}
                },{
                    new:true
                })
                .select("-password")
                .exec((err,result)=>{
                    if(err){
                        return res.status(422).json({error:err})
                    }
                    return res.status(201).json(result)
                })
            }
        })
        .catch(e=>{
            console.log(e)
        })
    }
    else{
        User.findByIdAndUpdate(req.user._id,{
            $set:{name,email}
        },{
            new:true
        })
        .select("-password")
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            return res.status(201).json(result)
        })
    }
    
})

router.delete("/deleteuser/:id",requireLogin,(req,res)=>[
    
    User.findOne({_id:req.params.id})
    .exec((err,user)=>{
        if(err || !user){
            return res.status(422).json({error:err})
        }
        
        if(req.params.id.toString() === req.user._id.toString()){
           user.remove()
           .then(result=>{
                Post.deleteMany({postedBy:req.user._id})
                .then(result2=>{
                    return res.status(200).json({result,result2})
                })
           })
           .catch(e=>{
               console.log(e)
           })
        }
        else{
            return res.status(401).json({error:"Unauthorized Action"})
        }

    })
])

module.exports = router