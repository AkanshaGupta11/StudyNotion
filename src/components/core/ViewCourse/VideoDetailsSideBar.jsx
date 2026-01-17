import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import {FaChevronLeft} from 'react-icons/fa'
import {MdOutlineKeyboardArrowDown} from 'react-icons/md'
import { FaAngleDoubleRight } from "react-icons/fa";

function VideoDetailsSideBar({setReviewModal}) {

    const [activeStatus, setActiveStatus] = useState(""); // which section actuve
    const [videoBarActive, setVideoBarActive] = useState(""); //which lec active 
    const {courseId,sectionId, subsectionId} = useParams(); //
    const navigate = useNavigate();
    const location = useLocation();
    const[showSidebar, setShowSidebar] = useState(false);
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures
    } = useSelector((state) => state.viewCourse);

//konsi video ko highlight kru 
useEffect(() => {
    console.log("courseSectionDt",courseSectionData)
    const setActiveFlags = () => {
        //section mai no data 
         if(!courseSectionData.length){
            return;
        }
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        )
        console.log("currsectionIndex",currentSectionIndex);
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.SubSection.findIndex(
            (data) => data._id === subsectionId
        )
        console.log("currSubSection",currentSubSectionIndex)
        // curr video visible
        const activeSubSectionId = courseSectionData[currentSectionIndex]?.SubSection[currentSubSectionIndex]?._id; //jho lecture open hain 
        console.log("activeSubSectionId",activeSubSectionId);
        console.log("activeSection",currentSubSectionIndex)
        setActiveStatus(courseSectionData?.[currentSectionIndex]?._id); // curr section  here 
        setVideoBarActive(activeSubSectionId) //current sub section 

    }
    setActiveFlags();
},[courseSectionData, courseEntireData,location.pathname])

 // In VideoDetailsSideBar.js
// Keep the state and useEffect at the top:
// const [showSidebar, setShowSidebar] = useState(false); // Make sure you re-add this state!
// ...

return (
<>

{/* 1. The Mobile Toggle Button (Visible only on small screens) */}
{/* This button shows when the sidebar is hidden (showSidebar is false) */}
    {/* It should be visible on mobile (not hidden by md:hidden) and only when sidebar is closed */}
    <div className={`fixed top-[3.5rem] ${showSidebar ? "hidden" : "block"} md:hidden z-30 m-2`}>
        <FaAngleDoubleRight 
            onClick={()=>{setShowSidebar(true);}} 
            className={`cursor-pointer text-4xl text-richblack-900 bg-richblack-100 rounded-full p-1`} 
        />
    </div>

{/* 2. The Main Sidebar Container */}
 <div className={`
        
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
        transition-all duration-300 fixed top-0 left-0 h-full z-40 flex
        md:relative md:translate-x-0 md:h-[calc(100vh-3.5rem)]
        w-[320px] max-w-[320px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 
    `}>
        <div className={`flex h-full w-[320px] max-w-[320px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800`}>
            
            {/* Header/Buttons section */}
            <div className='mx-5 flex flex-col items-start justify-between gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25'>
                <div className='flex w-full items-center justify-between '>
                    {/* Back button (Mobile closes sidebar, Desktop navigates) */}
                    <div className='flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-700 p-1 text-richblack-5 hover:scale-90 cursor-pointer'>
                        <FaChevronLeft 
                            className='cursor-pointer md:hidden' 
                            onClick={()=>{setShowSidebar(false)}} 
                        />
                        <FaChevronLeft 
                            className='cursor-pointer hidden md:block' 
                            onClick={()=>{navigate(`/dashboard/enrolled-courses`);}}
                        />
                    </div>
                    <IconBtn text={"Add Review"} onClick={()=>{setReviewModal(true)}}/>
                </div>
                {/* Course Name and Progress */}
                <div className='flex flex-col'>
                    <p> {courseEntireData?.courseName}</p>
                    <p className='text-sm font-semibold text-richblack-500'>
                        {completedLectures?.length} of {totalNoOfLectures} Lectures Completed
                    </p>
                </div>
            </div>
            
            {/* Sections and Subsections area */}
            <div className='h-full overflow-y-auto px-2'>
                {/* ... (Your existing map logic for sections/subsections goes here) ... */}
                {
                    courseSectionData?.map((section, index) => (
                        <details key={index} open = {activeStatus === section?._id} className=' appearance-none text-richblack-5 detailanimatation'>
                            <summary className='mt-2 cursor-pointer text-sm text-richblack-5 appearance-none'>
                                <div className='flex flex-row justify-between bg-richblack-600 px-5 py-4'>
                                    <p className='w-[70%] font-semibold'>{section?.sectionName}</p>
                                    <div className='flex items-center gap-3'>
                                        <MdOutlineKeyboardArrowDown className='arrow'/>
                                    </div>
                                </div>
                            </summary>
                            {
                                section?.SubSection.map((subSection, subIndex) => (
                                    <div key={subSection?._id} className='transition-[height] duration-500 ease-in-out'>
                                        <div onClick={()=>{
                                            // Close sidebar on mobile after clicking a lecture
                                            setShowSidebar(false); 
                                            navigate(`/view-course/${courseId}/section/${section?._id}/sub-section/${subSection?._id}`);
                                        }} className={`${subSection?._id === videoBarActive? ("bg-yellow-25 text-richblack-900"):("bg-richblack-900 text-richblack-50") } cursor-pointer items-baseline flex gap-3 px-5 py-2 font-semibold relative border-b-[1px] border-richblack-700 `}>
                                            <div className="checkbox-wrapper-19 absolute bottom-1">
                                                <input readOnly={true} checked={completedLectures?.includes(subSection?._id)} type="checkbox" />
                                                <label className="check-box"></label>
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

{/* 3. Mobile Overlay (Darkens background when sidebar is open) */}
    {/* Visible only on mobile when showSidebar is true */}
 <div onClick={()=>{setShowSidebar(false)}} className={`${showSidebar?"block":"hidden"} fixed inset-0 w-full h-full bg-richblack-900 bg-opacity-50 z-30 md:hidden`}></div>
 </>
 )
}

export default VideoDetailsSideBar


//ek lec show at a time , kani sb collapse 
//curr lec --> yellow highlight
