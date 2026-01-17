const SubSection = require("../models/SubSection")
const Section = require("../models/Section");
const Course = require("../models/Course")
const { uploadImageToCloudinary } = require("../utils/imageUploader.utils")
//create SubSection 
exports.createSubSection = async (req,res) => {
    try{
        //data fetch 
        const {sectionId, title , timeDuration , description , courseId} = req.body;
        //extract videoo
        const video = req?.files?.video;

        //validate
        if(!sectionId || !title  || !description) {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        const ifsection= await Section.findById(sectionId);
		if (!ifsection) {
            return res
                .status(404)
                .json({ success: false, message: "Section not found" });
        }

        //upload in cloudinary -> secure url mill jaayega 
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME); 
        console.log("Cloudinary Upload Details:", uploadDetails);
        //create SubSection 
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration: `${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url
        })
        //push SubSection in section 
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId},{
            $push:{
                SubSection: SubSectionDetails._id
            }
        },
        {new:true}).populate("SubSection");
        //log updatedd section here , add populate here 
        const updatedCourse = await Course.findById(courseId).populate({ path: "courseContent", populate: { path: "SubSection" } }).exec();
        //return response 
        return res.status(200).json({
            success:true,
            message:"SubSection created successfully ",
            data : updatedCourse,
        })
    }
    catch(error) {
        console.log("error in create subsection ",error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error : error.message,
        })
    }
};


exports.updateSubSection = async (req,res) => {

	try {
		// Extract necessary information from the request body
		const { SubSectionId, title , description, sectionId } = req.body;
		const video = req?.files?.video;

		
		let uploadDetails = null;
		// Upload the video file to Cloudinary
		if(video){
		 uploadDetails = await uploadImageToCloudinary(
			video,
			process.env.FOLDER_VIDEO
		);
		}

		// Create a new sub-section with the necessary information
		const SubSectionDetails = await SubSection.findByIdAndUpdate({_id:SubSectionId},{
			title: title || SubSection.title,
			// timeDuration: timeDuration,
			description: description || SubSection.description,
			videoUrl: uploadDetails?.secure_url || SubSection.videoUrl,
		},{ new: true });

		
		// const updatedCourse = await Course.findById(courseId).populate({ path: "courseContent", populate: { path: "SubSection" } }).exec();
        const updatedSection = await Section.findById(sectionId).populate("SubSection").exec();
		// Return the updated section in the response
		return res.status(200).json({ success: true, data: updatedSection });
	} catch (error) {
		// Handle any errors that may occur during the process
		console.error("Error creating new sub-section:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}

}


exports.deleteSubSection = async(req, res) => {

	try {
	const { SubSectionId, sectionId } = req.body;
	if(!SubSectionId || !sectionId){
		return res.status(400).json({
            success: false,
            message: "all fields are required",
        });
	}
	const ifSubSection = await SubSection.findById({_id:SubSectionId});
	if(!ifSubSection){
		return res.status(404).json({
            success: false,
            message: "Sub-section not found",
        });
	}
	await SubSection.findByIdAndDelete(SubSectionId);
    const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { $pull: { SubSection: SubSectionId } },
            { new: true }
        ).populate("SubSection").exec();	

        if (!updatedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found or could not be updated",
            });
        }
        
    return res.status(200).json({ success: true, 
        message: "Sub-section deleted", 
        data: updatedSection });
		
	} catch (error) {
		// Handle any errors that may occur during the process
        console.error("Error deleting sub-section:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
		
	}
};