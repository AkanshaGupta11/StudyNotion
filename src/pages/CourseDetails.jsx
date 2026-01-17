import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import {fetchCourseDetails} from '../services/operations/courseDetailsAPI'
import GetAvgRating from '../utils/avgRating';
import Error from './Error'
import ConfirmationModal from '../components/common/ConfirmationModal'
import RatingStars from '../components/common/RatingStars';
import { formatDate } from '../services/formatDate';
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard'
import toast from 'react-hot-toast';
import { buyCourse } from '../services/operations/studentFeaturesAPI';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BsGlobe } from 'react-icons/bs';
import { FaShareSquare } from 'react-icons/fa';
import {IoVideocamOutline} from 'react-icons/io5';
import { addToCart } from '../slices/cartSlice';
import { ACCOUNT_TYPE } from '../utils/constants';
import {FaChevronDown} from 'react-icons/fa';

function CourseDetails() {
    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {courseId} = useParams();
    const [courseData,setCourseData] = useState(null);
    const {loading} = useSelector((state) => state.profile)
    const {paymentLoading} = useSelector((state) => state.course);
    const[confirmationModal , setConfirmationModal] = useState(null);
    const [avgReviewCount , setAvgReviewCount] = useState(0);
    const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
    const {cart}=useSelector((state)=>state.cart);
    const [isActive, setIsActive] = useState(Array(0));
    
    
    //pura course lekr aau 
    useEffect(() => {
        const getCourseFullDetails = async() => {
            try{
                const result = await fetchCourseDetails(courseId,dispatch);
                console.log("res",result);
                if(result){
                    setCourseData(result);
                }
            }
            catch(error){
                console.log("Could not fetch course details", error);
                console.log("Could not fetch course details")
            }
        }
        getCourseFullDetails();
    },[courseId]);
    console.log("coursedt",courseData);

    //avg rating 
    useEffect(() => {
        if(courseData?.ratingAndReviews?.length > 0){
                    const count  = GetAvgRating(courseData?.ratingAndReviews);
                    setAvgReviewCount(count);
                    console.log("getCourseDetail->count",parseInt(count))

        }
    },[courseData])

    
    //number of lectures 
    const[totalNoOfLectures , setTotalNoOfLectures] = useState(0);
    //jaise hi response create hoga fatafat calculate kr lena 
    useEffect(() => {
        let lectures = 0;
        courseData?.courseContent?.forEach((sec) => lectures += sec.SubSection.length || 0)
        setTotalNoOfLectures(lectures);
    },[courseData])

    const handleAddToCart = () => {
        if(token){
            dispatch(addToCart(courseData));
        }
        else{
            navigate('/login')
        }
    }

    //isActive --> stores which section to show 
    //empty--> by default every thing is close 

    const handleActive = (id) => {
        //toggling --> if open tho close krdo else close hain tho open krdo
        setIsActive(
            !isActive.includes(id) ?
            isActive.concat(id) :
            isActive.filter((e) => e != id)
        )
    }
    if(loading || !courseData){
        return(
            <div>
                Loading...
            </div>
        )
    }

    // if(!courseData.success){
    //     console.log("courseDtsucces",courseData.success);
    //     return (
    //         <>
    //         <Error/>
    //         </>
    //     )
    // }

    const handleBuyCourse = () => {

        if(token){
            buyCourse(token,[courseId],user,navigate,dispatch);
            return;
        }
        //else person not logged in and trying to buy course 
        setConfirmationModal({
            text1:"You are not Logged in",
            text2:"Please Login to purchase the course",
            btn1Text: "Login",
            btn2Text:"Cancel",
            btn1Handler:() => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        })

    }

    const {
        _id : course_id,
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentEnrolled,
        createdAt
    } = courseData;
  return (
    // <div>
    //         <button onClick={() => handleBuyCourse()} className='bg-yellow-50 p-6 mt-10'>BUY NOW</button>

    // </div>
    <div className='flex flex-col bg-richblack-900 text-richblack-5'>
        <div className='relative flex flex-col justify-start p-8 bg-richblack-800'>
        <div className='relative flex flex-col items-start justify-between w-11/12 gap-8 mx-auto max-w-maxContent text-richblack-5 lg:flex-row'>
        <div className = 'flex flex-col gap-4 lg:w-[60%]'>
            <h1 className='text-4xl font-bold text-richblack-5 sm:text-[42px]'>
            {courseName}
            </h1>
            <p className='text-richblack-200'>
            {courseDescription}
            </p>
        <div className='flex flex-wrap items-center gap-2 text-lg font-semibold'>
            <span className='text-yellow-25'><p>{avgReviewCount}</p></span>
            <RatingStars Review_Count={avgReviewCount} Star_Size = {24}/>
            <span className='text-richblack-200'>{`(${ratingAndReviews?.length} reviews)`}</span>
            <span className='text-richblack-200'>{`${studentEnrolled?.length} students enrolled)`}</span>
        </div>

        <div>
            <p className='text-richblack-25'>Created By {`${instructor.firstName} ${instructor.lastName}`}</p>
        </div>
        <div className='flex flex-wrap gap-5 text-lg'>
            <p>
                Created At {formatDate(createdAt)}
            </p>
            <p>
                {" "} English
            </p>
        </div>
    </div>
        <div className='right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:hidden lg:absolute lg:block'>
            <CourseDetailsCard course = {courseData}
            setConfirmationModal = {setConfirmationModal}/>
        </div>
        </div>
    </div>

        <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:mx-0 lg:w-[650px] xl:w-[700px]'>
            <div className='my-8 border border-richblack-600 bg-richblack-700 p-8 rounded-md'>
            <p className='text-3xl font-semibold'>What You Will Learn</p>
            <div className='mt-5'>
                {whatYouWillLearn}
            </div>
        </div>

        <div className='max-w-[830px]'>
            <div className='flex flex-col gap-3'>
                <p className='text-[28px] font-semibold'>Course Content</p>
            

            <div className='flex flex-wrap justify-between gap-2'>
                <div className='flex gap-2 text-richblack-50'>
                    <span>{courseContent.length} Section(s)</span>
                    <span>{totalNoOfLectures} Lectures</span>
                    <span>{courseData.totalDuration} total length</span>
                </div>

                
                    {/* //collapse all se saare section will close  */}
                    {/* //function -> arr create --> stores which section we will show open  */}
                    {/* //arr empty -> koi section empty nhi dikhana  */}
                    <button onClick={() => setIsActive([])}
                    className='text-yellow-25' >
                        Collapse All Sections 
                    </button>
                
            </div>
            
        </div>
        <div className='py-4'>
                        {/* Map your subsections here using your CourseAccordion component */}
                        {/* For now, just showing structure placeholder */}
                        {courseContent?.map((item, index)=> (
                             <details key={index} className=' border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 detailanimatation'>
                                        <summary className='flex cursor-pointer items-start justify-between bg-opacity-20 px-7  py-5 transition-[0.3s]'>
                                            <div className='flex items-center gap-2'>
                                            <FaChevronDown className='arrow '/>
                                            <span className='text-xl'>{item?.sectionName}</span>
                                            </div>
                                            <div className='space-x-4'>
                                                <span className='text-yellow-25'>{item?.SubSection?.length} Lecture(s)</span>
                                            </div>
                                        </summary>
                                        <div className='mt-5'>
                                            {
                                                item?.SubSection?.map((subItem, subIndex) => (
                                                    <div key={subIndex} className='relative overflow-hidden bg-richblack-900  p-5 border border-solid border-richblack-600'>
                                                        <div className='flex items-center gap-2'>
                                                        <IoVideocamOutline className='txt-lg text-richblack-5'/>
                                                        <span className='text-lg'>{subItem?.title}</span>
                                                        </div>
                                                    </div>
                                                    
                                                ))
                                            }
                                            </div>
                                    </details>
                        ))}
                    </div>


            {/* INSTRUCTOR DASHBOARD  */}
            <div className='max-w-[830px] mt-10'>
            <div className='my-8 border border-richblack-600 bg-richblack-700 p-8 rounded-md'>
            <p className='text-3xl font-semibold'>Author</p>
        
            <div className='flex items-center gap-3 mt-4'>
            {/* Instructor Profile Image */}
            <img 
                src={instructor?.image} 
                alt={`${instructor?.firstName} ${instructor?.lastName} profile`}
                className='h-14 w-14 rounded-full object-cover'
            />
            {/* Instructor Name */}
            <p className='text-xl font-semibold text-richblack-5'>
                {instructor?.firstName} {instructor?.lastName}
            </p>
        </div>
        
        {/* Instructor Bio/About */}
        <div className='mt-5 text-richblack-100'>
            
            <p>{instructor?.additionalDetails?.about}</p>
        </div>
    </div>
</div>

        </div>
    </div>

    {/* Mobile Card (Visible only on small screens) */}
            <div className='mx-auto block w-11/12 max-w-[350px] lg:hidden mb-10'>
                 <CourseDetailsCard 
                    course={courseData}
                    setConfirmationModal={setConfirmationModal}
                    handleBuyCourse={() => buyCourse(token, [courseId], user, navigate, dispatch)}
                 />
            </div>  








        {confirmationModal && <ConfirmationModal modalData ={confirmationModal}/>}

    </div>
  )
 }

export default CourseDetails


//courseData is coming null 

//detail and summary 
//Function: The <details> element is a container for content that the user can open and close on demand.

// Default State: By default, the content inside the <details> tag (except for the <summary>) is hidden, and only the summary is visible.