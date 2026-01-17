import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from "swiper/modules";

// Also ensure you import the main Swiper CSS
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

import ReactStars from 'react-stars';
import { ratingsEndpoints } from '../../services/apis';
import { apiConnector } from '../../services/apiConnector';
import { FaStar } from 'react-icons/fa';


function ReviewSlider() {
    const [reviews,setReviews] = useState([]);
    const truncateWords = 15;

    useEffect(()=>{
        const fetchAllReviews = async() => {
            const {data} = await apiConnector("GET",ratingsEndpoints.REVIEWS_DETAILS_API)
            // console.log("response",response);
            // console.log("responsedt",response.data.data);
            // console.log("ressuccess",response.data.success);
            console.log("data",data);
            if(data?.success){
                setReviews(data?.data);
            }

            //console.log("setting review",reviews);
        }

        fetchAllReviews();
    },[]);
    // This will run ONLY when 'reviews' actually updates
useEffect(() => {
    console.log("Reviews state has been updated:", reviews);
}, [reviews]);
  return (
    <div className='text-white'>
        <div className='h-[190px]  max-w-maxContent'>
            <Swiper
            //slidesPerView = {4}
            spaceBetween={24}
            loop ={true}
            freeMode = {true}
            autoplay = {{
                delay : 2500 ,
            }}
            modules = {[FreeMode,Pagination , Autoplay]}
            className = 'w-full'
            
            breakpoints={{
                0 : {
                    slidesPerView : 1,
                },

                640: {
                    slidesPerView : 2,
                },

                1024:{
                    slidesPerView : 3,
                },
                1280:{
                    slidesPerView :4,
                },
            }}>
                {
                    reviews.map((review,index) => (
                    <SwiperSlide key={index}>
                    <div className='flex flex-col gap-3  min-h-[180px] bg-richblack-800 p-3 text-sm text-richblack-25'>
                    {/* User Info (Profile Pic, Name, Course) */}
                    <div className='flex items-center gap-4'>
                    {/* Profile Image */}
                    <img 
                    src = {review?.user?.image ? review?.user?.image : `https://api.dicebar.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`}
                    alt = 'Profile Pic'
                    className='h-9 w-9 object-cover rounded-full'
                    />
                    <div className='flex flex-col'>
                    {/* Name */}
                    <h3 className='font-semibold text-richblack-5'>
                    {review?.user?.firstName} {review?.user?.lastName}
                    </h3>
                    {/* Course Name / Profession (Assuming this is what you want under the name) */}
                    <p className='text-xs text-richblack-200'>
                    {review?.course?.courseName || review?.user?.accountType}
                    </p>
                </div>
        </div>
        
        {/* Review Text */}
        <p className='font-medium text-richblack-25'>
            {/* Truncate the review text */}
            {review?.review.split(" ").length > truncateWords
                ? review?.review.split(" ").slice(0, truncateWords).join(" ") + "..."
                : review?.review}
        </p>

        {/* Rating and Stars */}
        <div className='flex items-center gap-2 mt-auto'>
            {/* Rating Number */}
            <p className='font-semibold text-yellow-50'>
                {review?.rating.toFixed(1)}
            </p>
            {/* Star Rating */}
            <ReactStars
                count={5}
                value={review.rating}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaStar />}
                fullIcon={<FaStar />}
            />
        </div>
    </div>
</SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    </div>
  )
}

export default ReviewSlider

//get all ratinf se data retrive 