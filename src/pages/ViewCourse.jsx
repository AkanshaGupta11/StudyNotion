import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { useParams } from 'react-router-dom';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';
import VideoDetailsSideBar from '../components/core/ViewCourse/VideoDetailsSideBar'

function ViewCourse() {

    const [reviewModal , setReviewModal] = useState(false);
    const {courseId} = useParams();
    const {token} = useSelector((state) => state.auth);
    const dispatch =useDispatch();

    useEffect(() => {
        const setCourseSpecificDetails = async() => {
            const courseData = await getFullDetailsOfCourse(courseId,token);
            console.log("viewcoursedt",courseData);
            if(courseData){
                dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
                dispatch(setEntireCourseData(courseData.courseDetails))
                dispatch(setCompletedLectures(courseData.completedVideos));

                let lectures = 0;
                courseData?.courseDetails?.courseContent?.forEach((sec)=>{
                    lectures += sec.SubSection.length
                })
                dispatch(setTotalNoOfLectures(lectures));
            }
        }
        setCourseSpecificDetails();
    },[courseId,token,dispatch])
  return (
    <div className=' flex w-screen'>
    
        <VideoDetailsSideBar setReviewModal = {setReviewModal}/>
        
        <div className='h-[calc(100vh - 3.5rem)] flex-1 overflow-auto w-full'> 
         <div className='mx-auto w-full'>
             <Outlet/> 
         </div>
        </div>
       
            
   
    
    {reviewModal && <CourseReviewModal setReviewModal = {setReviewModal}/>}
    </div>
  )
}

export default ViewCourse

//section 
//subsection 
//completed lec
//total number of lect
