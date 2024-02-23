const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} =  require('../keys')
const multer = require('multer');
const router = express.Router()
const {forget_password} = require('../controllers/userController')

const User = mongoose.model('User')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname);
//     }
//   });
  
//   const upload = multer({ storage: storage }).single('image');

//   router.post('/upload', (req, res) => {
//     console.log("upload running")
//     upload(req, res, (err) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send({ error: 'Failed to upload image' });
//       } else {
//         const newImage = new User({
//           image: {
//             data: req.file.filename,
//             contentType: 'image/png'
//           }
//         });
//         newImage.save()
//           .then(() => res.send("Successfully uploaded"))
//           .catch((err) => {
//             console.log(err);
//             res.status(500).send({ error: 'Failed to save image data to database' });
//           });
//       }
//     });
//   });
  

router.post('/signup',async(req,res)=>{
    console.log(req.body)
    

    const {email,password,name,username} = req.body
    try{
        const user = new User({email,password,name,username})
        await user.save() 
        const token = jwt.sign({userId:user._id},jwtkey)
        res.send({token})

    }catch(err){
        return res.status(422).send(err.message)

    }
    
    
})

// router.post('/edit-profile', async (req, res) => {
//     const { name, username } = req.body;
//     const userId = req.user.userId; 
//     console.log(userId)

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).send({ error: 'User not found' });
//         }
//         user.name = name;
//         user.username = username;

//         await user.save();


//         const token = jwt.sign({ userId: user._id }, jwtkey);

//         res.send({ user, token });
//     } catch (err) {
//         return res.status(500).send({ error: err.message });
//     }
// });

router.post('/edit-profile', async (req, res) => {
    const {name, username, email} = req.body; 
    try {
        const user = await User.findOne({ email }); 
        user.name = name;
        user.username = username;
        console.log("hello")

        await user.save();

        res.send({ user });
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
});


router.post('/signin', async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).send({error: "check all the fields"})
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(422).send({error: "email not found"})
    }
    try{
        await user.comparePassword(password);
        const token = jwt.sign({userId:user._id},jwtkey)
        res.send({token})

    }catch(err){
        return res.status(422).send({error: "wrong password"})
    }
    
})
const reset_password = async(req,res)=>{
    try{
        const token = req.query.token;
        const tokenData = await User.findOne({token:token});
        if(tokenData){
            const newPassword = req.body.password;
            const userData = await User.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newPassword,token:''}},{new:true});
            res.status(200).send({success:true,msg:"User password has been changed",data:userData})

        }
        else{
            res.status(200).send({success:true,msg:"this link has been expired"})
        }

    } catch (error){
        res.status(400).send({success:false,msg:error.message})
    }
}

router.post('/forget-password',forget_password)

router.get('/reset-password', reset_password);



module.exports = router