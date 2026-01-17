my course page 

my course heading     btn 

table type 
courses                 duration price actions
dummy course 1          2h        999   edit delete


table kliye --> responsive table , 
package download --> for responsive table 


my course niit loading -> course not dound 
delete course nhi ho rha 


select all k check box --> then delete 

ab edit waale btn ,mai clivk kr l 


CATEGORY CATALOG MAI NHI AA RHI THI 
API SE DATA THO CORRECT AAYA U FETCHED IT WRONG 
result.data.allCategory 
wer checking result.data.length --> which was object not array 


getcatalog data --> 
different category ,
selected course , 
frequent courses 


instructor 1st and secind name not visible 



swiper --> slider create j=krne k liyee 


instructor name not visible 
instructor was stroing id 
populate krwana pda 


npm i copy-to-clipboard


AB COURSE CLICK KRTE THO ALG PAGE OPEN HOTA --> WILL CREATE THAT 





COURSE VIDEO JHO VIEW HOGI 
side bar hain 
add review btn 
section subsection 


video shuru hoti 
once video completed --> mark as completed 
                    ---> rewatch , ---> next




UPDATE DETIALS --> ERROR 



ERROR 
NOT ABLE TO DESTRUCTURE 
API CALL KI --> data aaya nhi aabhi tk --> jb tk aaya nhi , apne fetch krne ki koshish ki hain 
LOADING LOGICC



COURSE REVIEW MODAL 
add review          

VIEW COURSE 
VIDEODETAILDASHBOARD 
COURSE REVIEW MODLAL
VIDEO DETAIL --> JHA VIDEO PLAY --> REWATCH , COMPLETE K OPTION 



ENROLLED COURSE --> 
COURSE SECTION DATA KO DESTRUCTURE KRNE MAI PROBLEM --> ISSUE KYU 


VIEW COURSE STATE 
slice mai add lekin reducer mai nhi 

cannot read properties of undefined --> map 




view course 
render check if course dt 
ueffect in infinite loop








                          <div
                            onClick={() => setActiveStatus(section?._id)}
                            key = {index}>
                            {/* section mai click --> sirf section wala part update , video waala nhi  */}
                            {/* sirf section k drop down khulega  */}
                                <div>
                                    <div>
                                        {section?.sectionName}
                                    </div>
                            {/* HW --> add arrrow icon  */}

                                </div>
                                {/* subsection */}
                                <div>
                                    {
                                        // active section k liye hi lec show 
                                        activeStatus === section?._id && (
                                            <div>
                                                {
                                                    section.SubSection.map((topic,index) => {
                                                        <div
                                                        className= {`flex gap-5 p-5 ${
                                                            videoBarActive === topic._id 
                                                            ? "bg-yellow-200 text-richblack-900" :
                                                            "bg-richblack-900 text-white"
                                                        }`}
                                                        key = {index}
                                                        //sub section mai click krenge tho video visible hogi and bg ko yellow mark krne k liye 
                                                        //setvideobaractive and video open --> navigate 
                                                        onClick = {() => {
                                                            navigate(
                                                                `/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${topic?._id}`
                                                            )
                                                            setVideoBarActive(topic?._id)
                                                        }}>
                                                            {/* //checkBox and subsection name  */}
                                                            {/* if markcompleted then only tick  */}
                                                            <input
                                                            type ='checkbox'
                                                            checked={completedLectures.includes(topic?._id)}
                                                            onChange ={() => {}}/>
                                                                <span>
                                                                    {topic.title}
                                                                </span>
                                                            
                                                            {/* // mere completed video ki list mai ye video ki id hain tho completed mark kro  */}

                                                        </div>
                                                    })
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                             </div>















import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';
import {AiFillPlayCircle} from "react-icons/ai";
import IconBtn from "../../common/IconBtn"

function VideoDetails() {

    const {courseId, sectionId, subSectionId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const playerRef = useRef();
    const location = useLocation();
    const {token} = useSelector((state) => state.auth);
    const {courseSectionData , courseEntireData , completedLectures} = useSelector((state) => state.viewCourse);
    
    const [videoData , setVideoData] = useState([]);
    const [videoEnded , setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const setVideoSpecificDetails = async() => {

            //chk data present or not 
            if(!courseSectionData.length){
                return ;
            }

            if(!courseId && !sectionId && !subSectionId){
                //wapas enrolled course 
                navigate("/dashboard/enrolled-courses");
            }

            //ab sb data present hain 
            //tho vho section k subsection ki video lau
            else{
                const filteredData = courseSectionData.filter((course) => course._id === sectionId)

                const filteredVideoData = filteredData?.[0].SubSection.filter((data) => data._id === subSectionId)

                setVideoData(filteredVideoData);
                setVideoEnded(false);
            }

            
        }
        setVideoSpecificDetails();
    },[courseSectionData, courseEntireData, location.pathname])


    //mai aapki video over hone k baad y tho prev y tho next 
    //if FIRST VIDEO tho ky prev k btn 
    const isFirstVideo = () => {
        //if section --> 0 and subsection bhi 0 --> first video 
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);

        const subSectionIndex = courseSectionData[currentSectionIndex].SubSection.findIndex((data) => data._id === subSectionId)

        if(currentSectionIndex == 0 && subSectionIndex === 0){
            return true;
        }
        else{
            return false;
        }
    }


    //last video tho next k btn show nhi hoga
    //last video --> n-1 index
    const isLastVideo =() => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id ===sectionId)
        
        const noOfSubSections = courseSectionData[currentSectionIndex].SubSection.length;

        const subSectionIndex = courseSectionData[currentSectionIndex].SubSection.findIndex((data) => data._id === subSectionId);

        if(currentSectionIndex === courseSectionData.length - 1 &&
            subSectionIndex === noOfSubSections -1
        ){
            return true;
        }
        else{
            return false;
        }
    }

    //2 scenario --> ek section mai nxt video , // dusre section mai video 
    const goToNextVideo = () => {
        const currSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);

        const noOfSubSections = courseSectionData[currSectionIndex].SubSection.length;

        const currSubSectionIndex = courseSectionData[currSectionIndex].Subsection.findIndex((data) => data._id === subSectionId);

        if(currSubSectionIndex != noOfSubSections - 1){
            //same section mai or lecture exist 
            const nxtSubSectionId = courseSectionData[currSectionIndex].SubSection[currSubSectionIndex + 1]._id;
            //iss video pr jau 
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section${nxtSubSectionId}`)

        }

        else{
            //diff sec ki 1st video 
            const nxtSectionId = courseSectionData[currSectionIndex + 1]._id;
            const nxtSubSectionId = courseSectionData[currSectionIndex + 1].SubSection[0]._id;

            navigate(`/view-course/${courseId}/section/${nxtSectionId}/sub-section/${nxtSubSectionId}`)
        }
    }

    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const currSubSectionIndex = courseSectionData[currentSectionIndex].SubSection.findIndex((data) => data._id === subSectionId);

        if(currSubSectionIndex != 0){
            //yaani same subsec mai prev exist 
            const prvSubSectionId = courseSectionData[currentSectionIndex].SubSection[currSubSectionIndex-1]._id;

            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prvSubSectionId}`);
        }

        else{
            //dusre section ki last video 

            const prvSectionId = courseSectionData[currentSectionIndex-1]._id;
            const noOfSubSection = courseSectionData[currentSectionIndex-1].SubSection.length;
            const prvSubSectionId = courseSectionData[currentSectionIndex-1].SubSection[noOfSubSection-1]._id;
            navigate(`/view-course/${courseId}/section/${prvSectionId}/sub-section/${prvSubSectionId}`);


        }
    }

    const handleLectureCompletion = async() => {
        ///dummy code , coursecompleted k controller nhi 
        setLoading(true);

        const result = await  markLectureAsComplete({courseId: courseId , subSectionId : subSectionId},token);
        //state update 
        if(result){
            dispatch(updateCompletedLectures(subSectionId));
        }
    }

  return (
    <div>
        {
            !videoData ? (
                <div>No Data Found</div>
            ) : (
                <div>
                    <Player
                    ref = {playerRef}
                    aspectRatio='16:9'
                    playsInline
                    onEnded={() => setVideoEnded(true)}
                    src = {videoData?.videoUrl}>

                    <AiFillPlayCircle />

                    {
                        videoEnded && (
                            <div>
                                {/* //jho phele se complete usmai mrks as complete thodii dikhao ge  */}
                                {
                                    !completedLectures.includes(subSectionId) && (
                                        <IconBtn
                                        disabled = {loading}
                                        onClick = {() => handleLectureCompletion()}
                                        text = {!loading ? "Mark as Completed" : "Loading.."}/>
                                    )
                                }

                                {/* //rewatch  */}
                                <IconBtn
                                disabled = {loading}
                                onClick = {() => {
                                    if(playerRef?.current){
                                        playerRef.current?.seek(0);
                                        setVideoEnded(false);
                                    }
                                }}
                                text = "Rewatch"
                                customClasses= " text-xl"/>

                                <div>
                                    {
                                        !isFirstVideo() && (
                                            <button 
                                            disabled = {loading}
                                            onClick={goToPrevVideo}
                                            className='blackButton'>
                                            Prev
                                            </button>
                                        )
                                    }

                                    {
                                        !isLastVideo() && (
                                            <button
                                            disabled = {loading}
                                            onClick={goToNextVideo}
                                            className='blackButton'>
                                            Next
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                    </Player>

                </div>
            )
        }

        <h1>
            {videoData?.title}
        </h1>
        <p>
            {videoData?.description}
        </p>
    </div>
  )
}

export default VideoDetails


//video ki need 
//rewatch mai --> video start se shuru hoga 
//dom k andr koi component ko modify --> useRef()
//video ko useRef k use krke rewatch start 
//konsi video dikhani --> want uska url 
//video end huyi ki nhi 


//page load kiya --> tho ek video visible hain 
//starting logic hona chahiye 
//useEffect use --> 1st render mai ky show kro 


//app.js mai router mai diff name and useparams mai different 

mark as completed not working 
as we click error 500 



DIKKAT KY HO RHI 
mark as completed mai , i am trying to find course id , user id 
lekin course  rpogress mai koi entry hi nhi hain 

thought ki when we enroll in course 
we should add course id and user id in course progres 

taki koi dikkat hi nhi 
payment jaise complete , course progres m















































import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserCourses } from '../../../services/operations/profileAPI.jsx';
import ProgressBar from "@ramonak/react-progress-bar"
import { useNavigate } from 'react-router-dom';

function EnrolledCourses() {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [enrolledCourses, setEnrolledCourses] = useState(null);
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(false);

    const getEnrolledCourses = async () => {
        setLoading(true);
        try {
            const response = await getUserCourses(token, dispatch);
            setEnrolledCourses(response?.courses);
            //ye tho kiya hi nhi 
            // setProgressData(response?.courseProgress);
        } catch (error) {
            console.log("Unable to fetch enrolled courses");
        }
        setLoading(false);
    }

    useEffect(() => {
        getEnrolledCourses();
    }, []);

    // const totalNoOfLectures = (course) => {
    //     let total = 0;
    //     console.log("course",course.courseContent);
    //     course.courseContent.forEach((section) => {
    //         total += section.SubSection.length;
    //     });
    //     return total;
    // }

    // Safe navigation handler
    // const handleCourseClick = (course) => {
    //     // Prevent crash if course has no content yet
    //     console.log("course",course);
    //     const firstSection = course?.courseContent?.[0];
    //     console.log("firstSection",firstSection);
    //     const firstSubSection = firstSection?.SubSection?.[0];
    //     console.log("firstSubSection",firstSubSection);
    //     if (firstSection && firstSubSection) {
    //         navigate(`/view-course/${course._id}/section/${firstSection._id}/sub-section/${firstSubSection}`);
    //     } else {
    //        // Optional: Show toast or alert here
    //        console.log("This course has no content yet.");
    //     }
    // }

    if (loading) {
        return (
            <div className='flex h-[calc(100vh-3.5rem)] w-full justify-center items-center'>
                <div className='spinner'></div>
            </div>
        )
    }

    return (
        <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
            <div className='text-3xl font-medium text-richblack-5 mb-8'>
                Enrolled Courses
            </div>

            {!enrolledCourses ? (
                <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                    <div className='spinner'></div>
                </div>
            ) : !enrolledCourses.length ? (
                <div className="grid h-[60vh] w-full place-content-center gap-y-4 text-center text-richblack-5">
                    <p className='text-2xl font-bold text-richblack-5'>You have not enrolled in any course yet.</p>
                    <p className='text-richblack-300'>Browse our catalog to find the perfect course for you.</p>
                    {/* Optional: Add a button to redirect to catalog */}
                    <button 
                        onClick={() => navigate('/catalog')}
                        className='mx-auto rounded-md bg-yellow-50 px-6 py-3 text-black font-bold hover:scale-95 transition-all duration-200'
                    >
                        Go to Courses
                    </button>
                </div>
            ) : (
                <div className='my-8 text-richblack-5'>
                    {/* Headings - Hidden on mobile for cleaner look */}
                    <div className='flex rounded-t-lg bg-richblack-500 text-richblack-50'>
                        <p className='w-[50%] px-5 py-3'>Course Name</p>
                        <p className='w-[25%] px-2 py-3'>Duration</p>
                        <p className='w-[25%] px-2 py-3'>Progress</p>
                    </div>

                    {/* Course Cards */}
                    <div className='flex flex-col border border-richblack-700 rounded-b-lg md:rounded-t-none rounded-t-lg overflow-hidden'>
                        {enrolledCourses.map((course,i,arr) => (
                            <div 
                            className={`flex items-center border border-richblack-700 ${
                            i === arr.length -1 ? "rounded-b-lg ":"rounded-none"}`} key = {i}>

                            <div
                            className = 'flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3'
                            onClick = {() => {
                                navigate(
                                `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/
                                sub-section/${course.courseContent?.[0]?.SubSection?.[0]?._id}`
                                )
                            }}>
                                
                            <img src={course.thumbnail} alt="course_img" 
                            className = 'h-14 w-14 rounded-lg object-cover'/>
                            
                            <div className = "flex max-w-xs flex-col gap-2">
                                <p className = "font-semibold">{course.courseName}</p>
                                <p className='text-xs text-richblack-300'>
                                    {
                                        course.courseDescription.length > 50
                                        ? `${course.courseDescription.slice(0,50)}...`
                                        : course.courseDescription
                                    }
                                </p>
                                </div>
                                </div>  
                                <div className='w-1/4 px-2 py-3'>{course?.totalDuration}</div> 
                                <div className='flex w-1/5 flex-col gap-2 px-2 py-3'>
                                <p>Progress :{course.progressPercentage || 0 }%</p>
                                <ProgressBar
                                    completed = {course.progressPercentage || 0}
                                    height = "8px"
                                    isLabelVisible = {false}
                                />
                                </div> 
                             </div>


















                            // Calculate progress logic outside JSX for cleanliness



                            // const courseProgress = progressData?.find((p) => p.courseID === course._id);
                            // const totalLectures = totalNoOfLectures(course);
                            // const completedLectures = courseProgress?.completedVideos?.length || 0;
                            // const progressPercentage = totalLectures === 0 ? 0 : (completedLectures / totalLectures) * 100;

                            // return (
                            //     <div
                            //         key={course._id || index}
                            //         className={`flex flex-col md:flex-row md:items-center border-b border-richblack-700 bg-richblack-900 last:border-none cursor-pointer hover:bg-richblack-800 transition-all duration-200`}
                            //         onClick={() => handleCourseClick(course)}
                            //     >
                            //         {/* Section 1: Image & Name */}
                            //         <div className='flex w-full md:w-[45%] items-center gap-4 px-5 py-4'
                            //         onClick={() => {
                            //             navigate(
                            //                 `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/
                            //                 sub-section/${course.courseContent?.[0]?.SubSection?.[0]?._id}`
                            //             )
                            //         }}
                            //         >
                            //             <img
                            //                 src={course.thumbnail}
                            //                 alt="course_thumbnail"
                            //                 className='h-14 w-14 rounded-lg object-cover border border-richblack-600'
                            //             />
                            //             <div className='flex flex-col gap-1'>
                            //                 <p className='font-semibold text-lg text-richblack-5'>
                            //                     {course.courseName}
                            //                 </p>
                            //                 <p className='text-xs text-richblack-300 font-normal truncate max-w-[200px] md:max-w-[300px]'>
                            //                     {course.courseDescription.length > 50 
                            //                         ? `${course.courseDescription.slice(0, 50)}...` 
                            //                         : course.courseDescription}
                            //                 </p>

                            //             </div>
                            //         </div>

                            //         {/* Section 2: Duration */}
                            //         <div className='w-full md:w-1/4 px-5 md:px-2 py-2 md:py-4 text-richblack-100 text-sm font-medium'>
                            //             <span className='md:hidden font-bold text-richblack-300 mr-2'>Duration:</span>
                            //             {course?.totalDuration || "2h 30m"}
                            //         </div>

                            //         {/* Section 3: Progress Bar */}
                            //         <div className='flex w-full md:w-1/5 flex-col gap-2 px-5 md:px-2 py-4'>
                            //             <p className='text-xs text-richblack-100'>
                            //                 Progress: {progressPercentage.toFixed(0)}%
                            //             </p>
                            //             <ProgressBar
                            //                 completed={progressPercentage || 0}
                            //                 height='8px'
                            //                 isLabelVisible={false}
                            //                 bgColor={progressPercentage === 100 ? "#06D6A0" : "#47A5C5"}
                            //                 baseBgColor="#2C333F"
                            //             />
                            //         </div>
                            //     </div>
                            // )
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default EnrolledCourses












import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import { getInstructorData } from '../../../../services/operations/profileAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';

function Instructor() {

    const [loading , setLoading] = useState(false)
    const [instructorData , setInstructorData] = useState(null);
    const [courses , setCourses] = useState([]);
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);

    useEffect(()=>{
        const getCourseDataWithStats = async() => {
            setLoading(true);
            const instructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);

            //HRR COURSE MAI KITNE BACHE , KITNA AMT 
            //BUT I WANT KI TOTAL AMT , TOTAL STUDENT , THO NEED TO ADD 
            console.log("instructorDt",instructorApiData);

            if(instructorApiData.length){
                setInstructorData(instructorApiData);
            }

            if(result){
                setCourses(result);
            }
            setLoading(false);
        }
        getCourseDataWithStats();
    },[])

    const totalAmount = instructorData?.reduce((acc,curr) => acc + curr.totalAmountGenerated,0);
    const totalStudents = instructorData?.reduce((acc,curr) => acc + curr.totalStudentsEnrolled,0);
    console.log("totalStudent",totalStudents);
    console.log("totalAmt",totalAmount);
  return (
    <div className='text-white'>
        <div>
            <h1>Hi {user?.firstName}</h1>
            <p>Let's Start Something new</p>
        </div>

        {
            loading?(<div className='spinner'></div>)
            : courses.length > 0
            ? (
                <div>
                    <InstructorChart courses = {instructorData} />
                    <div>
                        <p>Statistics</p>
                        <div>
                            <p>Total Courses</p>
                            <p>{courses.length}</p>
                        </div>
                        
                        <div>
                            <p>Total Students</p>
                            <p>{totalStudents}</p>
                        </div>

                        <div>Total Income</div>
                        <p>{totalAmount}</p>
                    </div>

                    <div>
                        {/* render 3 courses */}
                        <div>
                            <p>Your Courses</p>
                            <Link to = "/dashboard/my-courses"> 
                            <p>View All</p>
                            </Link>
                        </div>

                        <div>
                            {
                                courses.slice(0,3).map((course) => (
                                    <div>
                                        <img src = {course.thumbnail}/>
                                        <div>
                                            <p>{course.courseName}</p>
                                            <div>
                                                <p>{course.studentEnrolled.length}</p>
                                                <p> | </p>
                                                <p> Rs {course.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            )
            : (

                <div>
                    <p>You have not created any course yet </p>
                    <Link to ="/dashboard/addCourse">
                    Create a Course</Link>
                </div>
            )
        }
    </div>
  )
}

export default Instructor




CART STYLING 
LOGOUT BTN DASHBOARD WAALA


add course btn mai click --> pre filled form 



course view --> styling 
catalog page --> lecture slider mai make title of lectures visible 

if already bought to go to course k option nhi aa rha aa rha 
instructor can't buy 







<div className='flex flex-col items-center text-white'>
        <div className = 'relative'>
            <p>{courseName}</p>
            <p>{courseDescription}</p>
        <div>
            <span><p>{avgReviewCount}</p></span>
            <RatingStars Review_Count={avgReviewCount} Star_Size = {24}/>
            <span>{`(${ratingAndReviews?.length} reviews)`}</span>
            <span>{`${studentEnrolled?.length} students enrolled)`}</span>
        </div>

        <div>
            <p>Created By {`${instructor.firstName} ${instructor.lastName}`}</p>
        </div>
        <div className='flex gap-x-3'>
            <p>
                Created At {formatDate(createdAt)}
            </p>
            <p>
                {" "} English
            </p>
        </div>

        <div>
            <CourseDetailsCard course = {courseData}
            setConfirmationModal = {setConfirmationModal}/>
        </div>
        </div>

        <div>
            <p>What You Will Learn</p>
            <div>
                {whatYouWillLearn}
            </div>
        </div>

        <div>
            <div>
                <p>Course Content</p>
            </div>

            <div>
                <div>
                    <span>{courseContent.length} section(s)</span>
                    <span>{totalNoOfLectures}lectures</span>
                    <span>{courseData.totalDuration} total length</span>
                </div>

                <div>
                    {/* //collapse all se saare section will close  */}
                    {/* //function -> arr create --> stores which section we will show open  */}
                    {/* //arr empty -> koi section empty nhi dikhana  */}
                    <button onClick={() => setIsActive([])} >
                        Collapse All Sections 
                    </button>
                </div>
            </div>
            
        </div>











        {confirmationModal && <ConfirmationModal modalData ={confirmationModal}/>}

    </div>










    <div className='text-white'>
      
        <div>
            {/* //buttons and Headings */}
            <div>
                {/* //button */}
                <div>
           <div className='flex w-full items-center justify-between '>
            <div className='flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90'>
              <FaChevronLeft className=' cursor-pointer hidden md:block' onClick={()=>{
                navigate(`/dashboard/enrolled-courses`);
                }}/>
            </div>
                <IconBtn text={"Add Review"} onClick={()=>{setReviewModal(true)}}/>
            </div>
                </div>

                {/* //Headings */}
                <div className='flex flex-col'>
                    <p>
                        {courseEntireData?.courseName}
                    </p>
                    <p  className='text-sm font-semibold text-richblack-500'>
                        {completedLectures?.length} / {totalNoOfLectures}
                    </p>
                </div>

                {/* for sections and subsections  */}
                <div className='h-[calc(100vh - 5rem)] overflow-y-auto px-2'>
                    {
                        courseSectionData?.map((section,index)=>(
                            <details key={index} className=' appearance-none text-richblack-5 detailanimatation'>
                <summary className='mt-2 cursor-pointer text-sm text-richblack-5 appearance-none'>
                  <div className='flex flex-row justify-between bg-richblack-600 px-5 py-4'>
                    <p className='w-[70%] font-semibold'>{section?.sectionName}</p>
                    <div className='flex items-center gap-3'>
                      <MdOutlineKeyboardArrowDown className='arrow'/>
                    </div>
                  </div>
                </summary>
                {
                  section?.SubSection.map((subSection, index) => (
                    <div  key={subSection?._id} className='transition-[height] duration-500 ease-in-out'>
                      <div onClick={()=>{
                        setShowSidebar(true);
                        navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${subSection?._id}`);
                      }} className={`${subSection?._id === videoBarActive? ("bg-yellow-200"):("bg-richblack-50") } cursor-pointer items-baseline  flex gap-3  px-5 py-2 font-semibold text-richblack-800 relative border-b-[1px] border-richblack-600 `}>
                      {/* <input type='checkbox' className=' '/> */}
                      <div className="checkbox-wrapper-19 absolute bottom-1">
                        <input readOnly={true} checked={
                          completedLectures?.includes(subSection?._id)
                        }  type="checkbox" />
                        <label className="check-box">
                        </label>
                        </div>
                      <p className=' ml-6'>{subSection?.title}</p>
                      </div>
                    </div>
                  ))
                }
                </details>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>
    </>