const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth 
exports.auth = (req,res,next) => {
    try{
        //fetch token 
        const token = req.cookies?.token || req.body?.token || req.header("Authorization")?.replace("Bearer ","");
        console.log(">>> AUTH HEADER RAW:", req.headers.authorization);
        console.log("token'",token);
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not found"
            })
        }

        try{
            //verify token 
            const decode =jwt.verify(token,process.env.JWT_SECRET);
            console.log("decode:",decode)
            req.user = decode;
        }
        catch(error){
            //retur
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }
        next();
    }
    catch(error){
        console.log("auth middleware",error.message);
        return res.status(500).json({
            success:false,
            message:"Sommething went wrong while validating the token"
        })
    }
}

exports.isStudent = async (req,res,next) => {
    try{
        // if(req.user.role != Student ) > diff method this time 
        //db mai se acc type waali value nikal lo 
        if(req.user.accountType != "Student"){
            return res.status(401).json({
            success:false,
            message:"This is protected route for students only"
        });
        }
        next();
    }
    catch(error){
         return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again"
        })
    }
}

exports.isInstructor = async(req,res,next) => {
    try{
        if(req.user.accountType != "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor"
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified"
        })
    }
}

exports.isAdmin = async (req,res,next) => {
    try{
        if(req.user.accountType != "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for admin"
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified"
        })
    }
}