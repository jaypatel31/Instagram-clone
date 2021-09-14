const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin')
const ObjectId = require('mongoose').Types.ObjectId;

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body
    
    if(!title || !body || !pic){
        return res.status(422).json({error:"Please add all fields"})
    }
    req.user.password = undefined

    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })

    post.save().then(result=>{
        return res.status(200).json({post:result})
    })
    .catch(e=>{
        console.log(e)
    })
})

router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate('postedBy',"_id name")
    .populate('comments.postedBy',"_id name")
    .sort('-createdAt')
    .then((posts)=>{
        res.status(200).json({posts})
    })
    .catch(e=>{
        console.log(e)
    })
})

router.get('/getsubpost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate('postedBy',"_id name")
    .populate('comments.postedBy',"_id name")
    .sort('-createdAt')
    .then((posts)=>{
        res.status(200).json({posts})
    })
    .catch(e=>{
        console.log(e)
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate('postedBy',"_id name")
    .then((myposts)=>{
        res.status(200).json({myposts})
    })
    .catch(e=>{
        console.log(e)
    })
})

router.put("/like",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate('postedBy',"_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.status(201).json(result)
        }
    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate('postedBy',"_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.status(201).json(result)
        }
    })
})

router.put("/comment",requireLogin,(req,res)=>{
    const comment  = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate('postedBy',"_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.status(201).json(result)
        }
    })
})

router.put("/deletecomment",requireLogin,(req,res)=>{
    const {commentId} = req.body
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{comments:{_id:new ObjectId(commentId),postedBy:req.user._id}}
    },{
        new:true
    })
    .populate('postedBy',"_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.status(201).json(result)
        }
    })
})

router.delete("/deletepost/:postId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                return res.status(200).json({result})
            })
            .catch(e=>{
                console.log(e)
            })
        }else{
            return res.status(401).json({error:"Not your post"})
        }
    })
})

router.put("/updatepost",requireLogin,(req,res)=>{
    const {title,body,pic} = req.body
    Post.findOneAndUpdate({ "_id": req.body.postId,"postedBy":req.user._id },{
        $set:{title,body,photo:pic}
    },{
        new:true
    })
    .populate('postedBy',"_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        res.status(201).json(result);
    })
})

router.put("/updatecomment",requireLogin,(req,res)=>{
    const {text,commentId,postId} = req.body
    Post.findOneAndUpdate({"_id":new ObjectId(postId),"comments._id":new ObjectId(commentId)},{
        $set:{"comments.$.text":text}
    },{
        new:true
    })
    .populate('postedBy',"_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.status(201).json(result)
        }
    })
})

module.exports = router