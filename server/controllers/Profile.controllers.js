const User = require("../models/User");
const Profile = require("../models/Profile");
const {uploadImageToCloudinary} = require("../utils/imageUploader.utils")
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
//import 
const { convertSecondsToDuration } = require("../utils/secToDuration");

exports.updateProfile = async(req,res) => {
    try{
        //fetch data 
        const {dateOfBirth="", about ="" , contactNumber,firstName, lastName, gender=null} = req.body;
        const id = req.user.id;
        //user id
        //valiadtion 
        if(!contactNumber ){
            return res.status(400).json({
                success:false,
                message:"All field are required"
            })
        }
        //find profile
        //user ki id laau 
        //user k aandr profile id hogi 
        //profile info laau profile id
        const userDetails = await User.findById(id)
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update
        userDetails.firstName = firstName || userDetails.firstName;
        userDetails.lastName = lastName || userDetails.lastName;
        profileDetails.dateOfBirth = dateOfBirth || profileDetails.dateOfBirth;
        profileDetails.gender = gender || profileDetails.gender;
        profileDetails.about = about || profileDetails.about;
        profileDetails.contactNumber = contactNumber || profileDetails.contactNumber;
        await userDetails.save();
        await profileDetails.save();

        return res.status(200).json({
            success:true,
            message:"Profile updated succesfully",
            profileDetails
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update profile",
           
        })
    }
}

//delete acc 
exports.deleteAccount = async (req,res) => {
    try{
        //data fetch --. profile id pta hona chahiye 
        const id = req.user.id;
        //validate
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not found"
            });
        }
        //delete profile 
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //delete user 
        await User.findByIdAndDelete({_id:id});

        //TODO -> STUDENT ENROLLED BHI KM KRO 
        return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:true,
            message:"Not able to delete account "
        })
    }
}

//cron job
//how can we schedule a request 

exports.getAllUserDetails = async(req,res) => {
    try{
        //id lau 
        const id = req.user.id;
        //validation
        //user details 
        const userDetails = await User.findById(id).populate("additionalDetails").exec(); // ismai additional ki id hain 

        return res.status(200).json({
            success:true, 
            message:"User Data fetched successfully ",
            data:userDetails,
        })
        
        
    }
    catch(error){
        return res.status(500).json({
            success:true,
            message:error.message
        })
    }
}

exports.updateDisplayPicture = async (req, res) => {
	try {
		const displayPicture = req?.files?.pfp;
        console.log("dispaypic",displayPicture);
		const userId = req.user.id
		const image = await uploadImageToCloudinary(
			displayPicture,
			process.env.FOLDER_NAME,
			1000,
			1000
		)
		console.log(image)
		const updatedProfile = await User.findByIdAndUpdate(
			{ _id: userId },
			{ image: image.secure_url },
			{ new: true }
		)
		res.send({
			success: true,
			message: `Image Updated successfully`,
			data: updatedProfile,
		})
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		})
	}
}


//instructor dashboard
exports.getEnrolledCourses = async (req, res) => {
	try {
		const userId = req.user.id;
        let userDetails = await User.findOne({
            _id: userId,
        })
        .populate({
            path:"courses",
            populate:{
                path:"courseContent",
                populate:{
                    path:"SubSection",
                },
            },
        })
        .exec()

        userDetails = userDetails.toObject();
        var SubSectionLength = 0;
        for(var i = 0 ; i<userDetails.courses.length ; i++){
            let totalDurationInSeconds = 0
            SubSectionLength = 0
            for(var j = 0 ; j<userDetails.courses[i].courseContent.length; j++){
                totalDurationInSeconds += userDetails.courses[i].courseContent[j]
                .SubSection.reduce((acc,curr) => acc + parseInt(curr.timeDuration),0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                    totalDurationInSeconds
                )

                SubSectionLength += 
                userDetails.courses[i].courseContent[j].SubSection.length
            }

            let courseProgressCount = await CourseProgress.findOne({
                courseId : userDetails.courses[i]._id,
                userId : userId
            })
            courseProgressCount = courseProgressCount?.completedVideos.length

            if(SubSectionLength === 0){
                userDetails.courses[i].progressPercentage = 100
            }
            else{
                //to make it upto two decimal point 
                const multiplier = Math.pow(10,2)
                userDetails.courses[i].progressPercentage =
                Math.round(
                    (courseProgressCount / SubSectionLength) * 100 * multiplier
                ) / multiplier
            }
        }

        if(!userDetails){
            return res.status(400).json({
                success : false,
                message :`Could not find user with id : ${userDetails}`,
            })
        }
		// const user = await User.findById(id);
		// if (!user) {
		// 	return res.status(404).json({
		// 		success: false,
		// 		message: "User not found",
		// 	});
		// }
		// const enrolledCourses = await User.findById(id).populate({
		// 	path: "courses",
		// 	populate: {
		// 		path: "courseContent",
		// 	}
		// }
		// ).populate("courseProgress").exec();
		// console.log(enrolledCourses);
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails.courses,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}


//stats and course k data 

exports.instructorDashboard = async(req,res) => {
    console.log("hi");
    try{
        //jho user logged in hain vhi tho mera instructor hain 
        const courseDetails = await Course.find({instructor: req.user.id})
        console.log("coursedetail",courseDetails);
        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            //create a new object with the additional field 
            const courseDataWithStats = {
                _id : course._id,
                courseName : course.courseName,
                courseDescription : course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            }
            console.log("courseDatastats",courseDataWithStats);
            return courseDataWithStats
        })

        res.status(200).json({
            success : true,
            courses : courseData})
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            message:"Internal server Error"
        });
    }
}