const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");

exports.updateCourseProgress = async(req,res) => {
    //course progress k instance phele se hona chahiye 
    //mark as completed mark kr rhe -> yaani we should know konse course k section hai y 
    const {courseId , subSectionId} = req.body;
    const userId = req.user.id;

    try{
        //cjk subsection is valid or not 
        const subSection = await SubSection.findById(subSectionId);
        console.log("subsection",subSection);
        if(!subSection){
            return res.status(404).json({error:"Invalid Subsection"});
        }
        console.log("subsection validation done");
        //chk for old entry 
        let courseProgress = await CourseProgress.findOne({
            courseId: courseId,
            userId : userId,
        });
        console.log("courseProgress",courseProgress);
        if(!courseProgress){
            return res.status(404).json({
                success:false,
                message:"CourseProgress does not exist"
            })
        }

        

        //if valid
        //chk ki phele se completed video ko wapas completed tho mark ni kr rhe 

        else{
            //chk fore-completing video/subsection
            if(courseProgress.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    success: false,
                    message: "SubSection already completed"
                })
            }

            //push
            courseProgress.completedVideos.push(subSectionId);
        }

        await courseProgress.save();
        return res.status(200).json({
            success: true,
            message :"Course Progress updated successfully"
        })
    }

    catch(error){
        console.error(error);
        return res.status(400).json({error:"Internal server error"});
    }
}

//route