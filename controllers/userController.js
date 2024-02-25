const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} =  require('../keys')
const {emailUser,emailPassword} = require('../keys')
const router = express.Router()

const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const { config } = require('dotenv')

const User = mongoose.model('User')

const sendResetPasswordMail = async(email,token)=>{
    try{
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:emailUser,
                pass:emailPassword
            }
        });

        const mailOptions = {
            from:emailUser,
            to:email,
            subject:'Signify forget password ',
            html: '<p>Hi, please copy the link and <a href="http://localhost:3000/reset-password?token=' + token + '">reset your password</a>.</p>'

        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("mail has been sent",info.response)
            }
        })

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

// const forget_password = async(req,res)=>{
//     try{
//         const email = req.body.email
//         const password = req.body.password
//         const userData = await User.findOne({email:req.body.email});

//         if(userData){
//             const updatedUser = await User.findOneAndUpdate(
//                 { email },
//                 { password, token: randomString },
//                 { password},
//                 { new: true }
//             );
//             const forget_password = async(req,res)=>{
//     try{
//         const email = req.body.email
//         const password = req.body.password
//         const userData = await User.findOne({email:req.body.email});

//         if(userData){
//             const updatedUser = await User.findOneAndUpdate(
//                 { email },
//                 { password, token: randomString },
//                 { password},
//                 { new: true }
                
//             );


//             const randomString = randomstring.generate();
//             const data = await User.updateOne({email:email},{$set:{token:randomString}})
//             sendResetPasswordMail(userData.email,randomString)

//             res.status(200).send({success:true,msg:"bhai email check krle",email})

//         }
//         else{
//             res.status(200).send({success:true,msg:"This email does mot exist. "})

//         }

//     }catch (error) {
//         res.status(400).send({success:false,msg:error.message})
//     }
// }

//             const randomString = randomstring.generate();
//             const data = await User.updateOne({email:email},{$set:{token:randomString}})
//             sendResetPasswordMail(userData.email,randomString)

//             res.status(200).send({success:true,msg:"bhai email check krle",email})

//         }
//         else{
//             res.status(200).send({success:true,msg:"This email does mot exist. "})

//         }

//     }catch (error) {
//         res.status(400).send({success:false,msg:error.message})
//     }
// }

const forget_password = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email });

        if (userData) {
            await User.updateOne({ email }, { password });

            
            return res.status(200).json({ success: true, msg: "Password changed successfully" });
        } else {
            return res.status(400).json({ success: false, msg: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message });
    }
};




module.exports = {
    forget_password,
}