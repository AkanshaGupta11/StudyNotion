import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

// Also ensure you import the main Swiper CSS
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import "react-loading-skeleton/dist/skeleton.css";
import Course_Card from './Course_Card';


function CourseSlider({courses}) {
  console.log("courses",courses);
  return (
    <>
    {
      courses?.length ? (
        <Swiper 
         mousewheel={
                      {
                          enabled: true,
                          forceToAxis: true,
                      } 
                 }
                 keyboard={
                      {
                          enabled: true,
                          onlyInViewport: true,
                      }
                 }
                 allowSlidePrev={true}
                    slidesPerView={1}
                    loop={false}
                    spaceBetween={20}
                    pagination={true}
                    modules={[Pagination,Navigation,FreeMode,Mousewheel,Keyboard]}
                    className="mySwiper md:pt-5"
                    autoplay={{
                    delay: 1000,
                    disableOnInteraction: false,
                    }}
                    style={{
                        "--swiper-navigation-size": "20px",
                      }}
                    freeMode={true}
                    navigation={true}
                    // navigation={
                    //     {
                    //         nextEl: ".swiper-button-next",
                    //         prevEl: ".swiper-button-prev",
                    //     }
                    // }
                    breakpoints={{
                        300:{slidesPerView:2.1,spaceBetween:10,},
                        640:{slidesPerView:2.2,},
                        1024:{slidesPerView:3.1,}
                    }}>
          {
            courses.map((course , index) => (
              <SwiperSlide key = {index}>
                <Course_Card course = {course} Height={"lg:h-[250px] h-[100px]"}/>
              </SwiperSlide>
            ))
          }
        </Swiper>
      ) :(
        <div className='flex gap-4 overflow-hidden'>
                <SkeletonTheme baseColor="#2C333F" highlightColor="#161D29">
                <div className=''>
                  <Skeleton  className="md:h-[200px] lg:w-[400px] h-[100px] w-[200px] rounded-xl" />
                  <Skeleton className=" md:h-[20px] w-[70px] rounded-md" />
                  <Skeleton className="md:h-[20px] md:w-[400px] rounded-md" />
                  <Skeleton className="md:h-[20px] md:w-[400px] rounded-md"/>
                </div>
              </SkeletonTheme>
                <SkeletonTheme baseColor="#2C333F" highlightColor="#161D29">
                <div className=''>
                  <Skeleton  className="md:h-[200px] lg:w-[400px] h-[100px] w-[200px] rounded-xl" />
                  <Skeleton className=" md:h-[20px] w-[70px] rounded-md" />
                  <Skeleton className="md:h-[20px] md:w-[400px] rounded-md" />
                  <Skeleton className="md:h-[20px] md:w-[400px] rounded-md"/>
                </div>
              </SkeletonTheme>
                <SkeletonTheme baseColor="#2C333F" highlightColor="#161D29">
                <div className=''>
                  <Skeleton  className="md:h-[200px] lg:w-[400px] h-[100px] w-[200px] rounded-xl" />
                  <Skeleton className=" md:h-[20px] w-[70px] rounded-md" />
                  <Skeleton className="md:h-[20px] md:w-[400px] rounded-md" />
                  <Skeleton className="md:h-[20px] md:w-[400px] rounded-md"/>
                </div>
              </SkeletonTheme>
                </div>
      )
    }
    </>
  )
}

export default CourseSlider


//courses k array hain 
//usmai map lgayaa 
//swiper 
//every course in swiper slide mai chahiye 
