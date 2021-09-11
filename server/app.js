const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')
//VhCWaz5ukLPDhB5v



mongoose.connect(MONGOURI)
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo yeahh!!")
})

mongoose.connection.on('error',()=>{
    console.log("Error connecting ",err)
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})


