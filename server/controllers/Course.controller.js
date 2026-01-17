const Course = require("../models/Course");
const Category= require("../models/Category")
const User = require("../models/User")
const Section = require("../models/Section")
const {uploadImageToCloudinary} = require("../utils/imageUploader.utils");
const RatingAndReview = require("../models/RatingAndReview");
const { isStudent } = require("../middlewares/auth.middleware");
const CourseProgress = require("../models/CourseProgress")
const SubSection = require("../models/SubSection");

//createCourse 
exports.createCourse = async(req,res) => {
    try{
    //fetch data 
    let{courseName, courseDescription, whatYouWillLearn,price,category,tag, status , instructions} = req.body;

    //get Thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation 
    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }

    if (!status || status === undefined) {
			status = "Draft";
	}
    //check instructor or not --> ye tho middleware mai already kr liya hoga na phir wapas kyu kr rhe 
    //reason -> course mai instructor ki object id store krni pdti -> tho validation nhi hai ye -> info nikal rhe hain 
    //security certifier 
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});                 
    // todo : verify that userid and instruction id are same 
    if(!instructorDetails){
        return res.status(404).json({
            success:false,
            message:"Insructor details not found"
        })
    }

    //check given tag is valid or not 
    const CategoryDetails = await Category.findById(category);

    if(!CategoryDetails) {
        return res.status(404).json({
            success:false,
            message:"Category details not found"
        })
    }
    //uplaod image 
    const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

    //create an entry for new course 
    const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor:instructorDetails._id,
        whatYouWillLearn:whatYouWillLearn,
        price,
        tag:tag,
        category:CategoryDetails._id,
        thumbnail:thumbnailImage.secure_url,
        status: status,
		instructions: instructions,
    })

    //user ko update krna 
    //add the new course in the user schema of instructor 
    //uss user k record k andr , course k andr course ki id enter krunga 
    await User.findByIdAndUpdate(
        {_id: instructorDetails._id},
        {
            $push: {
                courses: newCourse._id,
            }
        },
        {new:true},
    );

    //update  the TAG k schema 
    //todo 
    await Category.findByIdAndUpdate(
        {_id: CategoryDetails._id},
        {
            $push : {
                courses : newCourse._id,
            }
        },
        {new:true},
    )

    return res.status(200).json({
        success: true,
        message: "Course Created Successfully",
        data: newCourse,
    })

    }

    //create an entry for new course 
    
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message: "Failed to create Course",
            error: error.message,
        })
    }
}

//get all courses handler function 

exports.getAllCourses = async(req,res) => {
    try{
        //find call bss 
        const allCourses = Course.find({},{courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentEnrolled:true,
        }).populate("instructor")
        .exec();

    return res.status(200).json({
            success: true,
            message:"Data for all courses fetched successfully ",
            data: allCourses,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch course data",
            error:error.message,
        })
    }
}

exports.getAllCourseDetails = async (req,res) => {
    try{
        //fetch course id 
        const {courseId} = req.body;
        
        //course detail
        //bht saari cheeje object id pass kiye hain --> we want full data --> populate 
        const courseDetails = await Course.find({_id:courseId})
                                                .populate(
                                                    {
                                                        path:"instructor", //ab user k aandr aditional detail mai -> profile k ref stored hain usko bhi populate
                                                        populate:{
                                                            path:"additionalDetails",
                                                        },
                                                        
                                                    }

                                                )
                                                .populate("category")
                                                //.populate("ratingAndreviews")
                                                .populate({                    //only populate user name and image
                                                    path:"ratingAndReviews",
                                                    populate:{path:"user"
                                                    ,select:"firstName lastName accountType image"}
                                                })
                                                .populate({
                                                    path:"courseContent",
                                                    populate:{
                                                        path:"SubSection",
                                                    }
                                                })
                                                .exec();
        //validatiom 
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message:`Could not find the course with course id ${courseId} `
            })
        }

        return res.status(200).json({
            success:true,
            message:"Course details fetched successfully",
            data: courseDetails
        })

    } catch(error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//function to get all instructor courses 

exports.getInstructorCourses = async(req,res) => {
    try{
        //get userid 
        const userid = req.user.id;

        if (!userid) {
        return res.status(400).json({
            success: false,
            message: "User ID not found in request",
        })
    }
        //find all courses of the instructor 
        const allCourses = await Course.find({instructor:userid});

        //return all courses of instructor 
        res.status(200).json({
            success:true,
            data: allCourses,
        });

    }
    catch(error){
        //
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Failed to fetch courses",
            error:error.message,
        })
    }
}


exports.editCourse = async (req, res) => {
	try {
	  const { courseId } = req.body
	  const updates = req.body
	  const course = await Course.findById(courseId)
  
	  if (!course) {
		return res.status(404).json({ error: "Course not found" })
	  }
  
	  // If Thumbnail Image is found, update it
	  if (req.files) {
		console.log("thumbnail update")
		const thumbnail = req.files.thumbnailImage
		const thumbnailImage = await uploadImageToCloudinary(
		  thumbnail,
		  process.env.FOLDER_NAME
		)
		course.thumbnail = thumbnailImage.secure_url
	  }
  
	  // Update only the fields that are present in the request body
	  for (const key in updates) {
		if (Object.prototype.hasOwnProperty.call(updates,key) && key !== "courseId") {
		  if (key === "tag" || key === "instructions") {
			course[key] = JSON.parse(updates[key])
		  } else {
			course[key] = updates[key]
		  }
		}
	  }
  
	  await course.save()
  
	  const updatedCourse = await Course.findOne({
		_id: courseId,
	  })
		.populate({
		  path: "instructor",
		  populate: {
			path: "additionalDetails",
		  },
		})
		.populate("category")
		.populate("ratingAndReviews")
		.populate({
		  path: "courseContent",
		  populate: {
			path: "SubSection",
		  },
		})
		.exec()
  
	  res.json({
		success: true,
		message: "Course updated successfully",
		data: updatedCourse,
	  })
	} catch (error) {
	  console.error(error)
	  res.status(500).json({
		success: false,
		message: "Internal server error",
		error: error.message,
	  })
	}
  }

  //get full course details
  exports.getFullCourseDetails = async (req, res) => {
	try {
	  const { courseId } = req.body
	  const userId = req.user.id
	  const courseDetails = await Course.findOne({
		_id: courseId,
	  })
		.populate({
		  path: "instructor",
		  populate: {
			path: "additionalDetails",
		  },
		})
		.populate("category")
		.populate("ratingAndReviews")
		.populate({
		  path: "courseContent",
		  populate: {
			path: "SubSection",
		  },
		})
		.exec()

		
	  let courseProgressCount = await CourseProgress.findOne({
		courseId: courseId,
		userId: userId,
	  })
  
	  console.log("courseProgressCount : ", courseProgressCount)
  
	  if (!courseDetails) {
		return res.status(400).json({
		  success: false,
		  message: `Could not find course with id: ${courseId}`,
		})
	  }
  
	  // if (courseDetails.status === "Draft") {
	  //   return res.status(403).json({
	  //     success: false,
	  //     message: `Accessing a draft course is forbidden`,
	  //   });
	  // }
  
	//   let totalDurationInSeconds = 0
	//   courseDetails.courseContent.forEach((content) => {
	// 	content.SubSection.forEach((subSection) => {
	// 	  const timeDurationInSeconds = parseInt(subSection.timeDuration)
	// 	  totalDurationInSeconds += timeDurationInSeconds;
	// 	})
	//   })
  
	//   const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
	console.log(courseDetails);
	  return res.status(200).json({
		success: true,
		data: {
		  courseDetails,
		//   totalDuration,
		  completedVideos: courseProgressCount?.completedVideos
			? courseProgressCount?.completedVideos 
			: ["none"],
		},
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}
  }


//Delete Course
exports.deleteCourse = async (req, res) => {
	try {
	  const { courseId } = req.body
	  // Find the course
	  const course = await Course.findById(courseId)
	  if (!course) {
		return res.status(404).json({ message: "Course not found" })
	  }
  
	  // Unenroll students from the course
	  const studentsEnrolled = course.studentEnrolled
	  for (const studentId of studentsEnrolled) {
		await User.findByIdAndUpdate(studentId, {
		  $pull: { courses: courseId },
		})
	  }
  
	  // Delete sections and sub-sections
	  const courseSections = course.courseContent
	  for (const sectionId of courseSections) {
		// Delete sub-sections of the section
		const section = await Section.findById(sectionId)
		if (section) {
		  const subSections = section.SubSection
		  for (const subSectionId of subSections) {
			await SubSection.findByIdAndDelete(subSectionId);
		  }
		}
  
		// Delete the section
		await Section.findByIdAndDelete(sectionId)
	  }
  
	  // Delete the course
	  await Course.findByIdAndDelete(courseId)

	  //Delete course id from Category
	  await Category.findByIdAndUpdate(course.category._id, {
		$pull: { courses: courseId },
	     })
	
	//Delete course id from Instructor
	await User.findByIdAndUpdate(course.instructor._id, {
		$pull: { courses: courseId },
		 })
  
	  return res.status(200).json({
		success: true,
		message: "Course deleted successfully",
	  })
	} catch (error) {
	  console.error(error)
	  return res.status(500).json({
		success: false,
		message: "Server error",
		error: error.message,
	  })
	}
  }



  //search course by title,description and tags array
  exports.searchCourse = async (req, res) => {
	try {
	  const  { searchQuery }  = req.body
	//   console.log("searchQuery : ", searchQuery)
	  const courses = await Course.find({
		$or: [
		  { courseName: { $regex: searchQuery, $options: "i" } },
		  { courseDescription: { $regex: searchQuery, $options: "i" } },
		  { tag: { $regex: searchQuery, $options: "i" } },
		],
  })
  .populate({
	path: "instructor",  })
  .populate("category")
  .populate("ratingAndReviews")
  .exec();

  return res.status(200).json({
	success: true,
	data: courses,
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}		
}					

//mark lecture as completed
exports.markLectureAsComplete = async (req, res) => {
	const { courseId, subSectionId, userId } = req.body
	if (!courseId || !subSectionId || !userId) {
	  return res.status(400).json({
		success: false,
		message: "Missing required fields",
	  })
	}
	try {
	const progressAlreadyExists = await CourseProgress.findOne({
				  userID: userId,
				  courseID: courseId,
				})
	  console.log("progress",progressAlreadyExists)
	  const completedVideos = progressAlreadyExists.completedVideos
	  console.log("completedVideo",completedVideos);
	  if (!completedVideos.includes(subSectionId)) {
		await CourseProgress.findOneAndUpdate(
		  {
			userID: userId,
			courseID: courseId,
		  },
		  {
			$push: { completedVideos: subSectionId },
		  }
		)
	  }else{
		return res.status(400).json({
			success: false,
			message: "Lecture already marked as complete",
		  })
	  }
	  await CourseProgress.findOneAndUpdate(
		{
		  userId: userId,
		  courseID: courseId,
		},
		{
		  completedVideos: completedVideos,
		}
	  )
	return res.status(200).json({
	  success: true,
	  message: "Lecture marked as complete",
	})
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}

}