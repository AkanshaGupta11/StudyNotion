import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Tbody, Td, Th, Thead, Tr} from 'react-super-responsive-table';
// import { formatDate } from "../../../../services/formatDate"
import { COURSE_STATUS } from '../../../../utils/constants';
import ConfirmationModal from '../../../common/ConfirmationModal';
import {deleteCourse,fetchInstructorCourses} from "../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { useNavigate } from "react-router-dom"
import { HiMiniPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { FaClock } from "react-icons/fa";
export default function CourseTable({courses, setCourses}) {

    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth);
    const [loading , setLoading] = useState(false);
    const [confirmationModal , setConfirmationModal] = useState(null);
    const navigate = useNavigate();
    const handleCourseDelete = async(courseId) => {
        setLoading(true);

        await deleteCourse({courseId:courseId},token);
        const result = await fetchInstructorCourses(token);
        console.log("result",result);
        if(result){
            setCourses(result);
        }
        setConfirmationModal(null);
        setLoading(false);
    }

    if(loading) {
    return (
        <div className="custom-loader"></div>
    )
    }
  return (
    <div className = "text-white">
        <Table className="rounded-xl border border-richblack-800 ">
            <Thead>
                <Tr className="grid grid-cols-[1fr_8rem_8rem_8rem] gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2 text-richblack-100">
                    <Th className=" text-left text-sm font-medium uppercase text-richblack-100">
                        Courses
                    </Th>
                    <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                        Duration
                    </Th>
                    <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                        Price
                    </Th>
                    <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                        Actions
                    </Th>
                </Tr>
            </Thead> 
            <Tbody>
                {
                    courses?.length === 0 ? (
                        <Tr>
                            <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                                No Courses Found
                            </Td>
                        </Tr>
                    ) : (
                        courses?.map((course)=>(
                            <Tr key ={course?._id} className = "grid grid-cols-[1fr_8rem_8rem_8rem] gap-x-10 border-b border-richblack-800 px-6 py-8 gap-4">
                            <Td className ="flex flex-1 gap-x-4 p-3">
                                <img 

                                src ={course?.thumbnail}
                                className ="md:h-[148px] md:w-[220px] aspect-video rounded-lg object-cover"
                                />

                                <div className ="flex flex-col gap-1 justify-between">
                                    <p className="text-lg font-semibold text-richblack-5 mt-3">{course.courseName}</p>
                                    <p>{course?.courseDescription}</p>
                                    {/* <p className="text-xs text-richblack-300">{course?.courseDescription.split(" ")?.length >
                                    TRUNCATE_LENGTH
                                    ? course.courseDescription
                                    .split(" ")
                                    .slice(0, TRUNCATE_LENGTH)
                                    .join(" ") + "..."
                                    : course.courseDescription}</p> */}
                                    {/* <p>Created : {formatDate}</p> */}
                                    {
                                        course.status === COURSE_STATUS.DRAFT ? (
                                            <div>
                                              <FaClock className='mt-1  bg-gray-600 rounded-xl px-2' />
                                            <p className='text-pink-100'>DRAFTED</p>
                                            </div>
                                        ) :
                                        (
                                            <div className='flex gap-1.5 bg-gray-600 rounded-xl px-2'>
                                                <TiTick className='mt-1' /> 
                                            <p className='text-yellow-200'>PUBLISHED</p>

                                            </div>
                                        )
                                    }
                                </div>
                            </Td>

                            <Td className="text-md font-medium text-richblack-100">
                                2hr 30min
                            </Td>

                            <Td className="text-md font-medium text-richblack-100 mb-5">
                                ${course.price}
                            </Td>

                            <Td className="text-md font-medium text-richblack-100 ">
                                <button
                                disabled ={loading}
                                onClick={() => {
                                    navigate(`/dashboard/edit-course/${course._id}`)
                                }}
                                
                                className='px-5'>
                                <HiMiniPencilSquare className='size-6' />
                                 </button>

                                <button 
                                disabled = {loading}
                                onClick ={() => {
                                    setConfirmationModal({
                                        text1:"Do You want to delete this course ?",
                                        text2:"All the data related to this course will be deleted",
                                        btn1Text:"Delete",
                                        btn2Text:"Cancel",
                                        btn1Handler: !loading ? () => handleCourseDelete(course._id): ()=>{},
                                        btn2Handler: !loading ? () => setConfirmationModal(null) : () => {},
                                    })
                                }}
                                className ="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]">
                                   <MdDelete size ={20}/>
                                </button>
                            </Td>
                            </Tr>
                        ))
                    )
                }
            </Tbody>
        </Table>
        {confirmationModal && <ConfirmationModal modalData = {confirmationModal} />}
    </div>
  )
}

