const Category = require("../models/Category");



//create tag handler function 
exports.createCategory = async(req,res) => {
    try{
        //fetch data 
        const {name , description} = req.body;

        //validation 
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //create entry in db 
        const CategoryDetails = await Category.create({
            name:name,
            description:description,
        })
        console.log("CategoryDetails",CategoryDetails);

        return res.status(200).json({
            success:true,
            message:"Category created successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:error.message,
        })
    }
}


//get all tags 
exports.showAllCategory = async (req,res) => {
    try{
        const allCategory = await Category.find({},{name:true,description:true}); /// saaree saare tags le aau --> make sure krna ki sbmai name desc ho 
        return res.status(200).json({
            success:true,
            message:"All Category returned succesfully",
            allCategory,
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

///category page details --> 
exports.categoryPageDetails = async(req,res) => {
    try{
        //get category id 
        const { categoryId } = req.body;

        //uss category id k correspond jitne bhi course hain 
        const selectedCategory = await Category.findById(categoryId).populate({ path: "courses", match: { status: "Published" }, populate: ([{ path: "instructor" }, { path: "ratingAndReviews" }]) })
			.exec();
        //get courses for specified course id 
        //validation
        if(!selectedCategory) {
            return res.status(400).json({
                success:false,
                message:"Course not found "
            })
        }

        // Handle the case when there are no courses
		if (selectedCategory.courses.length === 0) {
			console.log("No courses found for the selected category.");
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}

        //getcoursesfordiffcategory 
        const differentCategories = await Category.find({
            _id:{$ne : categoryId}, //not equal to category id 
        })
        .populate({ path: "courses", match: { status: "Published" }, populate: ([{ path: "instructor" }, { path: "ratingAndReviews" }]) });
       
        let differentCourses = [];
		for (const category of differentCategories) {
			differentCourses.push(...category.courses);
		}

        //get top selling courses 
        const allCategories = await Category.find()
        .populate({
            path:"courses",
            match:{status:"Published"},
            populate:([
                {path:"instructor"},
                {path:"ratingAndReviews"}
            ])
        });

        const allCourses = allCategories.flatMap((category) => category.courses);
        // Using flatMap => allCourses array would be ['Course 1', 'Course 2', 'Course 3', 'Course 4'] like this.

        const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold) //most sold first 
			.slice(0, 10);

        //return response
        return res.status(200).json({
            selectedCategory: selectedCategory,
			differentCategories: differentCategories,
			mostSellingCourses: mostSellingCourses,
			success: true,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}