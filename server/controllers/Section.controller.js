const Section = require("../models/Section");

const Course = require("../models/Course")

exports.createSection = async (req,res) => {
    try{

        //data fetch 
        const {sectionName , courseId , sectionId} = req.body;
        //secName -> iske acc db mai entry create ho 
        //courseid --> course mai section ko push kru 
        console.log(">>> createSection received:", {sectionName,sectionId, courseId, bodyKeys: Object.keys(req.body)});

        //validation 
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:'Missing properties'
            })
        }

        const ifcourse= await Course.findById(courseId);
		if (!ifcourse) {
			return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        //create section 
        const newSection = await Section.create({
            sectionName
        });
        
        //update course , push section id in course 
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,{
            $push:{
                courseContent : newSection._id,
            }
        },
        {new : true},
        )
        .populate({
            path:"courseContent",
            populate:{
                path:"SubSection"
            },
        })
        
        .exec();
        //////////////////// use populate to replace section / sub section both in updated course 
        
        //return res 
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails,
            data : updatedCourseDetails
        })


    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message : "Unable to create section , please try again",
            error:error.message
        })
    }
}


exports.updateSection = async(req,res) => {
    try{
        //data input 
        const {sectionName, sectionId, courseId} = req.body;

        //data validation 
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            })
        }
        //update findnupdate 
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true})
        //agr section mai update kr rhe tho course mai bhi krna pdega ky ?? NHIIIII 
        //kyuki course mai tho section ki id pdi hain 
        //return response 

        const updatedCourse = await Course.findById(courseId).populate({ path: "courseContent", populate: { path: "SubSection" } }).exec();
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            updatedCourse,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update section",
            error:error.message
        })

    }
};

exports.deleteSection = async(req,res) => {
    try{
        //fetch data 
        //passing section id in param 
        //suppose we r sending id in paarama 

        const {sectionId, courseId} = req.body;
       
        //findbyid delete
        await Section.findByIdAndDelete(sectionId); //auto delete higya course -> kyu hua ye find out krna 
        //delete from schema as well because -> course schema still has list of coursecontent -> still contain section id we deleted just now 
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
                courseContent: sectionId,
            },
        });
        const updatedCourse = await Course.findById(courseId).populate({ path: "courseContent", populate: { path: "SubSection" } }).exec();
        //TODO : DO WE NEED TO DELETE THE ENTRY FROM SCHEMA 
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
            updatedCourse,
        })
    }

    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete section",
            error:error.message
        })
    }
}