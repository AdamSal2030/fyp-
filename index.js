const { config } = require('dotenv');
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')

const app = express()
const PORT = 3000
const {mogoUrl} = require('./keys')



require('./models/User')
const requireToken = require('./middleware/requireToken')
const authRoutes = require('./routes/authRoutes')



app.use(bodyParser.json())
app.use(authRoutes)

const uri  = "mongodb+srv://f2020266300:hello123@cluster0.7et7l7n.mongodb.net/?retryWrites=true&w=majority"

async function connect(){
    try{
        await mongoose.connect(uri)
        console.log("mongodb connected")
    } catch(error){
        console.error(error)

    }
}
connect()

const Storage = multer.diskStorage({
    destination:'uploads',
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    },
});

const upload = multer({
    storage:Storage
}).single('testImage')

app.post('/upload',(req,res)=>{
    console.log("upload running")
    upload(req,res,(err)=>{
        if(err){
            console.log(err)
        }
        else{
            const newImage = new User({
                image:{
                    data:req.file.filename,
                    contentType:'image/png'
                }
            })
            newImage.save()
            .then(()=>res.send("succesfully uploaded"))
            .catch((err)=>console.log(err))
        }
    })
})

app.get('/',requireToken,(req,res)=>{
    res.send("email:"+ req.user.email)
})



app.listen(PORT,()=>{
    console.log("server is running"+PORT)
})