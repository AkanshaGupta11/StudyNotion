const User = require("../models/User");
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")

//resetPasswordToken
exports.resetPasswordToken = async(req,res) =>{
    try{
        //get email-//
    const {email} = req.body;

    //chk user for email 
    const user = await User.findOne({email:email});
    if(!user) {
        return res.json({
            success:false,
            message:"your email is not registered"
        })
    }
    //link generate/ generate token 
    const token = crypto.randomUUID();

    //hrr user k pass token , or expiration time hain 
    //uPdate user by adding token and expiration time 
    const updatedDetails = await User.findOneAndUpdate({email:email},{
        token : token,
        resetPasswordExpires: Date.now() + 15*60*1000
    },
    {new:true}

)
    console.log("DETAILS",updatedDetails);
    
    //create url 
    
    const url = `http://localhost:3000/update-password/${token}`

    //end mail 
    await mailSender(email, "Password Reset Link" , ` reset link :${url}`)

    //return response
    return res.json({
        success:true,
        message:"Email sent successfully "
    })

    }
    catch(error){
       console.log(error);
       return res.status(500).json({
        success:false,
        message:"Something went wrong while reseting password"
       }) 
    }
}

exports.resetPassword = async(req,res) => {
    try{
        //fetch 
    const {password,confirmPassword,token} = req.body; 
    //validation 
    if(password != confirmPassword){
        return res.json({
            success:false,
            message:"Password not matching"
        })
    }
    //get user details from db using token 
    const userDetails = await User.findOne({token:token});
    console.log("userdetails",userDetails);
    //nif no entry -> invalid token 
    if(!userDetails){
        return res.json({
            success:false,
            message:"Token is invalid"
        })
    }
    //token time out 
    if(userDetails.resetPasswordExpires < Date.now()){
        //expire
        return res.json({
            success:false,
            message:"Token is expired , regenerate your token"
        })
    }
    //hash pass
    const hashPass = await bcrypt.hash(password,10);
    
    //password Update
    await User.findOneAndUpdate({token:token},{
        password:hashPass},
        {new:true},
    )
    //return res
    return res.status(200).json({
        success:true,
        message:"Password reset successful"
    })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong, try again"
        })
    }
}

//jho token aaye usk aky use > 
//user k aandr pass ko update kreneg --> user ko kesse bulaaye 



//reset krne aaye 
//email enter kiye 
//email id mai link aayega , frontend k link aayega -> link pai click , u mai aa gye 

//resetPasswordToken

//resetPassword