const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");

const database = require("./config/database");
const cookieParser = require("cookie-parser"); // will read the cookie from frontend
const cors = require("cors"); // security tool Yeh ek security tool hai. By default, ek browser localhost:3000 (aapka frontend) ko localhost:4000 (aapka backend) se baat karne nahi deta. cors iski permission deta hai.
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 4000;

//database connect 
database.connect();

//middleware 
app.use(express.json()); // if any json format , javascript object mai bdl kr -> req.body mail dall do 
app.use(cookieParser());
app.use(
    cors({
        origin:["http://localhost:3000" , "http://localhost:4000","https://study-notion-jgyt.vercel.app"], // jho bhi request 3000 se aa rhi usko entertain krna bht imp hain 
        credentials:true,
    })
)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

//cloudinary connection 
cloudinaryConnect();

//routes mount 
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);


//default route 
app.get("/",(req,res) => {
    return res.json({
        success: true,
        message:"Your server is up and running...."
    })
})


//activate 
app.listen(PORT, () => {
    console.log(`app is running at ${PORT}`)
})
//mera backend entertain frontend request 