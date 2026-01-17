import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { addToCart } from '../../../slices/cartSlice';
import copy from 'copy-to-clipboard';
import { buyCourse } from '../../../services/operations/studentFeaturesAPI';
import { useParams } from 'react-router-dom';
import { FaShareSquare } from 'react-icons/fa';

function CourseDetailsCard({course, setConfirmationModal}) {
    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {courseId} = useParams();

    const {
        thumbnail : ThumbnailImage,
        price : CurrentPrice,
    } = course;

//n koi instructor , no koi jisne log in nhi kiya vho add to cart nhi kr skte 

    const handleAddToCart = () => {
        if(user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR){
            toast.error("You are an Instructor , You can not buy a course");
            return ;
        }

        if(token){
            dispatch(addToCart(course));
            return;
        }
        setConfirmationModal({
            text1: "You are not in logged in",
            text2: "Please Login to add to cart",
            btn1:"login",
            btn2:"cancel",
            btn1Handler: () =>navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        })
    }

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

    //share kr rhe --> link copy ho and toast dikhao 
    const handleShare = () => {
        copy(window.location.href);
        toast.success("Link copied to clipboard")
    }
  return (
    <div className='flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5 shadow-2xl'>
        <img src={ThumbnailImage} alt="Thumbnail Image" className='max-h-[300px] min-h-[180px] w-full rounded-2xl object-cover'/>
        <div className='space-x-3 pb-2 text-3xl font-semibold'>Rs. {CurrentPrice}</div>
        <div className='flex flex-col gap-4'>
            <button className='w-full'
            onClick={
                        user && course?.studentEnrolled.includes(user?._id)
                        ? () => navigate("/dashboard/enrolled-courses")
                        : handleBuyCourse
                    }>
                {/* //ONCLICK  */}
                {/* //if already bought --> go to course 
                //else buy now  */}
                {/* //course k student enrolled mai jau --> will get if he had bought or not  */}

                {
                        user && course?.studentEnrolled.includes(user?._id) ? (
                            <div className='flex items-center justify-center w-full px-6 py-3 font-semibold text-center text-white transition-all duration-200 rounded-md bg-richblack-800 hover:scale-95 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]'>
                                Go To Course
                            </div>
                        ) : (
                            <div className='flex items-center justify-center w-full px-6 py-3 font-semibold text-center text-black transition-all duration-200 rounded-md bg-yellow-50 hover:scale-95 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]'>
                                Buy Now
                            </div>
                        )
                    }
            </button>

            {/* //BUY KIYA HAIN tho add to cart nhi dikhe g  */}
            {
                (!course?.studentEnrolled.includes(user?._id)) && (
                    <button onClick = {handleAddToCart}
                    className='flex items-center justify-center w-full px-6 py-3 font-semibold text-center text-white transition-all duration-200 rounded-md bg-richblack-800 hover:scale-95 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]'>Add to Cart</button>
                )
            }
        </div>
        <div className='text-center text-sm text-richblack-25 pb-3 pt-3'>
            <p>30-Day Money-Back Guarantee</p>
            <p>This Course Includes:</p>
            <div className='flex flex-col gap-y-3 text-sm text-caribbeangreen-100'>
                {
                    course?.instructions?.map((item,index) => (
                        <p key = {index} className = 'flex gap-2 items-center'>
                            <span className='text-lg'>{item}</span>
                        </p>
                    ))
                }
            </div>
        </div>

        <div className='text-center'>
            <button onClick={handleShare}
            className='mx-auto flex items-center gap-2 py-2 text-yellow-200'>
                <FaShareSquare size={15}/> Share
            </button>
        </div>
    </div>
  )
}

export default CourseDetailsCard