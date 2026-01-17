const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/Profile")
const {passwordUpdated} = require("../mail/templates/passwordUpdate")
//const { configDotenv } = require("dotenv");
require("dotenv").config();

//sendOTP 
exports.sendOTP = async(req,res) => { 
    try{
        //fetch email from req ki bo
    const {email} = req.body;
    //check user exist 
    const checkUserPresent = await User.findOne({email});

    //if user exist -> bhaga do 
    if(checkUserPresent){
        return res.status(401).json({
            success: false,
            message:"User already registered"
        })
    }

        //generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets : false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
        //6 length k otp , upper , lower , special -> false mark 
        console.log("otp generated" , otp);

        //make sure otp is unique 
        //db mai already store krte jaa rhe hona -> tho chk kr lo ki already exist tho nhi krta 
        let result = await OTP.findOne({otp : otp});
        //jb tk otp milega tb tk will generate new 
        while(result){
        otp = otpGenerator(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        result = await OTP.findOne({otp : otp});
       }
       //create an entry in db 
       const otpPayload = {email,otp};
       const otpBody = await OTP.create(otpPayload);

       console.log("otpbody",otpBody);

       //RETURN RESPONSE
       res.status(200).json({
        success:true,
        message:"Otp generated successfully",
        otp,
       });

       

    }

    catch(error){
        console.log("Problem in Otp generation",error);
        return res.json({
            success:false,
            message:error.message
        })
    }
}



//SIGNUP 
exports.signup = async(req,res) => {
    try{
        //Destructure fields from request body 
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contacTNumber,
            otp
        } = req.body;
      
        //check if all field are present
        if(!firstName || !lastName || !email || ! password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }

        // check if password nad confirm password matches
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and ConfirmPassword value does not match , try again"
            })
        } 

        //check if user already exists 
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({
                success:false,
                message:"User is already registered"
            });
        }

        //find most recent otp from user 
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1); // fetch all otp of user with this email -> sort with created at in descending order -1->desc , 1->asce .limit -? only return the 1st document , most recent otp record 
        console.log("otp",otp);
        console.log("recentotp",recentOtp);
        
        //validate otp 
        if(recentOtp.length == 0){
            //otp not found for the mail
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            })
        }
        //recentotp -> is iving array 
        
        else if (otp !== recentOtp[0].otp){
            console.log(otp == recentOtp.otp);
            console.log("recent",recentOtp[0].otp);
            return res.status(400).json({
                success:false,
                message:"Invalid otp"
            })
        }
        //hash pass->bcrypt needed
        const hashedPassword = await bcrypt.hash(password,10);

        //entry create in db 
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contacTNumber:null,
        }) // additional detail mai profile thi usske liye chahiye  , db mai entry create krenge jb hi object id millegi 

        const user = await User.create({
            firstName,
            lastName,
            email,
            contacTNumber,
            password : hashedPassword,
            accountType : accountType,
            confirmPassword,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        })

        //return res
        return res.status(200).json({
            success:true,
            message:"user is registered successfully",
            user,
        })
    }
    catch(error){
        console.log("signup problem",error);
        return res.status(400).json({
            success:false,
            message:"User cannot be registered  please try again"
        })
    }
}


//LOGIN 
exports.login = async(req,res) => {
    try{
           //fetch details 
    const {email , password} = req.body ;

    //validate 
    if(!email || !password){
        return res.status(403).json({
            success:false,
            message:"All fields are required"
        })
    }

    //user check 
    const user = await User.findOne({email}).populate("additionalDetails");
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User not registered , signup first"
        })
    }

//password match 
    if(await bcrypt.compare(password , user.password)){
        const payload = {
            email : user.email,
            id: user._id , 
            accountType:user.accountType,
        }

        //token
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"24h"
        }) ;
        /////////
        user.token = token ;
        user.password = undefined;

        //create cookie 
        const options ={
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly : true
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in successfully"
        })

    }

    else{
        return res.status(401).json({
            success:false,
            message:"Password is incorrect"
        })
    }
 



// send response 
    }

    

    catch(error){
        console.log("User cannot login" , error);
        return res.status(500).json({
            success:false,
            message:"Login failure , please try again"
        })
    }
}


//changePassword 
exports.changePassword = async(req,res) => {
    try{
        //get user details 
        const userDetails = await User.findById(req.user.id);

        //get old pass , new pass, confirm new pass
        const {oldPassword, newPassword, confirmNewPassword} = req.body;
        console.log("req",req.body);
        //validate , old pass matches to prev pass
        const ispasswordMatch = await bcrypt.compare(oldPassword,userDetails.password)

        if(!ispasswordMatch){
            return res.status(401).json({
                success:false,
                message:"The password is incorrect"
            })
        }

        //if new and old pass are same 
        if(oldPassword === newPassword){
            return res.status(400).json({
                success:false,
                message:"New Password cannot be same as Old Password"
            })
        }
        console.log("new",newPassword);
        console.log("old",confirmNewPassword);
        //match new and confirm password
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                success:false,
                message:"password and confirm password do not match"
            })
        }

        //match hogye tho hashing 
        const hashPassword = await bcrypt.hash(newPassword,10)

        //entery in db 
        const updatePassword = await User.findByIdAndUpdate(req.user.id,
            {password:hashPassword},
            {new:true}
        );

        //send notification email 
        try{
            const mailResponse = await mailSender(
                userDetails.email,
                "StudyNotion - password Update",
                passwordUpdated(
                    updatePassword.email,
                    `Password updated successfully for ${updatePassword.firstName} ${updatePassword.lastName}`
                )
            )
            console.log("Email sent successfully :",mailResponse.response)
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:"Eroor occured while sending mail"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Password updated successfully"
        })

        
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error occured while updating password",
            error:error.message
        })
    }
} 
   







//sendotp -> jb tk otp verify nhi hoga signup nhi kr skte 
//signup 
//login 

//changepass
//auth middleware , isStudent , isAdmin  , isInstructor



//sendOTP 


exports.updatePassword = async(req,rs) => {
     //fetch userdetail 
     const userDetails = await User.findOne(req.user.id);

     //fetch old,new,confirm 
     const {oldPassword,newPassword,confirmPassword} = req.body;

     //match old == user.pas ->bcrytp.compare
     //match new == old 
    //match new == confirm pass
    //hash pass
    //db mai findbyidandupdate 
}