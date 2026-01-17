const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async(email , title , body) => {
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, //smtp.gmail.com
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        let info = transporter.sendMail({
            from :"StudyNotion - by Edtech Giant",
            to:`${email}`,
            subject: `${title}`,
            html: `${body}`
        })
        console.log(info);
        return info;


    }
    catch(error) {
        console.log(error.message);
    }
}

module.exports = mailSender;



//otp ko mail mai send kr pau -> isliye mailsender function likha hain 