const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course")

// create rating 
exports.createRating = async (req,res) => {
    try{
        //course k page mai -> rating di , review di , course ko diya hain , kisne diya han 
        //user if 
        const userId = req.user.id;
        //fetch data
        const {rating, review, courseId} = req.body;
        //check if user is enrolled or not 
        const courseDetail = await Course.find({_id:courseId,
                                                studentEnrolled:{$elemMatch : {$eq: userId}}, //elemMatch -eq
                            });
        if(!courseDetail){
            return res.status(404).json({
                success:false,
                message:"Student not enrolled in the course",
            });
        }
        
        // check if user already reviewed the course 
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        })
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"Course is already reviewed by user"
            })
        }
        //create rating 
        const ratingReview = await RatingAndReview.create({
            rating,review,
            course:courseId,
            user:userId
        });
        
        //update course model
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            {_id:courseId},
            {$push:{
                ratingAndReviews : ratingReview._id
            }},
            {new:true}
        )
        console.log("updatedCourseDetail",updatedCourseDetails);
        //return response 
        return res.status(200).json({
            success:true,
            message:"Rating and Review successfully",
            ratingReview
        })


    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//find average rating 
//aggregation , dif idf queries ko order wise apply kr skte 
//multiple queries ko aggregate 
exports.getAverageRating = async(req,res) => {
    try{
        //get course id 
        const courseId = req.body.courseId;
        //calculate average rating 
        const result = await RatingAndReview.aggregate([ // aggregate call mai kuch steps bta di 
            {
                $match:{ // iss criteria correspond matching kro 
                    course: new mongoose.Types.ObjectId(courseId), //esa course course string to object id 
                    //bht saari entry aa gyi course ki , jismai course id hain 
                }
            },
            {   //single group bnana hain 
                $group:{
                    _id:null , //jitne bhi entry aayei thi sb ko single grp mai grp kiya 
                    averageRating : {$avg : "$rating"},
                }
            }
        ])
        //no one did rating 
        //return rating

        if(result.length > 0){
            //mtlb rating mil gyi 
            return res.status(200).json({
                success:true,
                averageRating : result[0].averageRating,
            })
        }

        //if no rating review exist 
        return res.status(200).json({
            success:false,
            message:"Average Rating is 0, no rating given till now",
            averageRating:0,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//getall ratingAndReviews --> COURSE K NEECHE JHO BHT SAARI RATING VISIBLE HAIN
exports.getAllRating = async(req,res) => {
    //course id k corresponding rating review laani hain 

    //y function saari saari ki rating review l aayega 
    try{
        //rating review mai userid or rating , review , courseid hain 
        //userid , courseid -> obj id hain ese nhi chahiye 
        //populate kr denge 
        const allReviews = await RatingAndReview.find({}).sort({rating:"desc"})
                            .populate({
                                path:"user",
                                select:"firstName lastName email image" // user k andr kis kis field ko populate krna 
                            })
                            .populate({
                                path:"course",
                                select:"courseName",
                            })
                            .exec();
        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allReviews,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}








































































































































































































































