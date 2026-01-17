const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
// const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const {paymentSuccess} = require("../mail/templates/paymentSuccess");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollementEmail")

exports.capturePayment = async (req, res) => {
    //get courseId and UserID
    //jho course buy krne and user jho buy kr rha 
    const {courses} = req.body;
    const userId = req.user.id;
    //validation
    //valid courseID
    try{
    if(courses.length === 0) {
        return res.json({
            success:false,
            message:'Please provide valid course ID',
        })
    };

    let totalAmount = 0;

    for(const course_id of courses){
        let course;
        // console.log("courseid=",course_id);
        try{
            course = await Course.findById(course_id);
            if(!course) {
                return res.json({
                    success:false,
                    message:'Could not find the course',
                });
            }
    
            //user already pay for the same course
            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentEnrolled.includes(uid)) {
                return res.status(200).json({
                    success:false,
                    message:'Student is already enrolled',
                });
            }
            totalAmount += course.price;
            //total amount that need to be shown at time of checkout
        }
        catch(error) {
            console.error(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
        ;
    }

    //order create krne k liye options ki need hoti 
        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: Math.random(Date.now()).toString(),
        };

        try{
            //initiate the payment using razorpay
            //create order 
            const paymentResponse = await instance.orders.create(options);
            console.log("payment",paymentResponse);
            //return response
            return res.status(200).json({
                success:true,
                orderId: paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
                message :paymentResponse,
            });
        }
        catch(error) {
            console.error(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
    
};



//verify the signature
exports.verifySignature = async (req, res) => {
    //server mai api logic written --> signature verification
    //razorpay signature and signature u created-> matches or not 
    //if yes --> successful payment --> assign course
        //get the payment details
        // const razorpay_order_id = req.body?.razorpay_order_id
        const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;
        const {courses} = req.body;
        const userId = req.user.id;

        //validation 
        if(!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !courses || !userId) {
            return res.status(400).json({
                success:false,
                message:'Payment details are incomplete',
            });
        }

        let body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature === razorpay_signature){
            //enroll kro 
            await enrollStudents(courses,userId,res);

            return res.status(200).json({
                success:true,
                message:"Payement Verified"
            });
        }
        return res.status(200).json({
            success:"false",
            message:"Payement Failed"
        });
    }       


const enrollStudents = async (courses, userId,res) => {
        //ho will enroll-> traverse in every course and push userid in evry course , whichever bought
        //2 cheeje course mai student enroll mai add
        //student mai course mai append 

            if(!courses || !userId) {
                return res.status(400).json({
                    success:false,
                    message:'Please provide valid courses and user ID',
                });
            }
             
            //every course mai append kro student ko 
            try{
                        //update the course
                for(const courseId of courses){
                    console.log("verify courses=",courseId);
                    const enrolledCourse = await Course.findByIdAndUpdate(
                            {_id:courseId},
                            {$push:{studentEnrolled:userId}},
                            {new:true}
                    );

                    if(!enrolledCourse){
                        return res.status(500).json({
                            success:false,
                            message:"Course not found"
                        })
                    }

                    //course progress logic 
                    const newCourseProgress = await CourseProgress.create({
                        userId : userId,
                        courseId :courseId,
                        completedVideos : [],
                    })
                    //every student has a course list 
                        //update the user
                        const enrolledStudent = await User.findByIdAndUpdate(userId,
                            {$push : {
                                courses: courseId,

                                courseProgress : newCourseProgress._id,
                            }},{new:true},
                        );

                        //send mail to student
                        const emailResponse = await mailSender(
                            enrolledStudent.email,
                            `Successfully Enrolled into ${enrolledCourse.courseName}`,
                            courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
                        )
                        console.log("Email sent Successfully",emailResponse);
                    }        
            }

            catch(error){
                console.log(error)
                return res.status(500).json({
                    success:false,
                    message:error.message
                })
            }
    }

exports.sendPaymentSuccessEmail = async(req,res) => {
    const {orderId,paymentId,amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({
            success : false,
            message : "Please provide all the details"
        })
    }

    //user id se find user ,find their email and then send mail to them 
    try{
        const enrolledStudent = await User.findById(userId);
    await mailSender(enrolledStudent.email,
        `Payment Received`,
        paymentSuccess(`${enrolledStudent.firstName} `,
            amount/100,
            orderId, paymentId)
        )
    }

    catch(error){
        console.log("error in sending mail",error);
        return res.status(500).json(
            {
                success : false,
                message : "could not send email"
            }
        )
    }

}

    
//                         //set course progress
//                         const newCourseProgress = new CourseProgress({
//                             userID: userId,
//                             courseID: course_id,
//                           })
//                           await newCourseProgress.save()
                    
//                           //add new course progress to user
//                           await User.findByIdAndUpdate(userId, {
//                             $push: { courseProgress: newCourseProgress._id },
//                           },{new:true});
//                         //send email
//                         const recipient = await User.findById(userId);
//                         console.log("recipient=>",course);
//                         const courseName = course.courseName;
//                         const courseDescription = course.courseDescription;
//                         const thumbnail = course.thumbnail;
//                         const userEmail = recipient.email;
//                         const userName = recipient.firstName + " " + recipient.lastName;
//                         const emailTemplate = courseEnrollmentEmail(courseName,userName, courseDescription, thumbnail);
//                         await mailSender(
//                             userEmail,
//                             `You have successfully enrolled for ${courseName}`,
//                             emailTemplate,
//                         );
//                         }
//                         return res.status(200).json({
//                             success:true,
//                             message:'Payment successful',
//                         });
//                     }
//                     catch(error) {
//                         console.error(error);
//                         return res.status(500).json({
//                             success:false,
//                             message:error.message,
//                         });
//                     }
                
//             }

//         try{
//             //verify the signature
//             const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");
//             if(generatedSignature === razorpay_signature) {
//                 await enrolleStudent(courses, userId);
//             }

//         }
//         catch(error) {
//             console.error(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }

     
//     }




// //send email

// exports.sendPaymentSuccessEmail = async (req, res) => {
//     const {amount,paymentId,orderId} = req.body;
//     const userId = req.user.id;
//     if(!amount || !paymentId) {
//         return res.status(400).json({
//             success:false,
//             message:'Please provide valid payment details',
//         });
//     }
//     try{
//         const enrolledStudent =  await User.findById(userId);
//         await mailSender(
//             enrolledStudent.email,
//             `Study Notion Payment successful`,
//             paymentSuccess(amount/100, paymentId, orderId, enrolledStudent.firstName, enrolledStudent.lastName),
//         );
// }
//     catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }
// }























