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
    const options = {
        maintainAspectRatio: false,
    }
    // Added this state to handle the styling of the chart toggle buttons
    const [currentChart, setCurrentChart] = useState('revenue');

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
    <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
            <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
                {loading ? (
                    <div className='spinner'></div>
                ) : courses.length > 0 ? (
                    <div>
                        {/* Header Section */}
                        <div className='space-y-2'>
                            <h1 className='text-2xl font-bold text-richblack-5'>Hi {user?.firstName} 👋</h1>
                            <p className='font-medium text-richblack-200'>Let's Start Something new</p>
                        </div>

                        {/* Top Section: Chart & Stats */}
                        <div className='my-4 flex flex-col-reverse gap-3 md:flex-row md:flex md:h-[450px] md:space-x-4'>
                            
                            {/* Chart Section */}
                            <div className='flex flex-1 flex-col  rounded-md bg-richblack-800 p-6 w-full'>
                                <div className='flex items-center justify-between'>
                                    
                                </div>
                                {/* Passed currentChart props in case your chart component needs it later */}
                                <InstructorChart courses={instructorData} currentChart={currentChart} options = {options}/>
                            </div>

                            {/* Statistics Section */}
                            <div className='flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6'>
                                <p className='text-lg font-bold text-richblack-5'>Statistics</p>
                                <div className='mt-4 space-y-4'>
                                    <div>
                                        <p className='text-lg text-richblack-200'>Total Courses</p>
                                        <p className='text-3xl font-semibold text-richblack-50'>{courses.length}</p>
                                    </div>

                                    <div>
                                        <p className='text-lg text-richblack-200'>Total Students</p>
                                        <p className='text-3xl font-semibold text-richblack-50'>{totalStudents}</p>
                                    </div>

                                    <div>
                                        <p className='text-lg text-richblack-200'>Total Income</p>
                                        <p className='text-3xl font-semibold text-richblack-50'>Rs {totalAmount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Courses Section */}
                        <div className='rounded-md bg-richblack-800 p-6'>
                            <div className='flex items-center justify-between'>
                                <p className='text-lg font-bold text-richblack-5'>Your Courses</p>
                                <Link to="/dashboard/my-courses">
                                    <p className='text-xs font-semibold text-yellow-50'>View All</p>
                                </Link>
                            </div>

                            <div className='my-4 flex items-start space-x-6'>
                                {courses.slice(0, 3).map((course) => (
                                    <div key={course._id} className='w-1/3'>
                                        <img 
                                            src={course.thumbnail} 
                                            alt={course.courseName}
                                            className='aspect-video md:h-[201px] w-full rounded-md object-cover' 
                                        />
                                        <div className='mt-3 w-full'>
                                            <p className='text-sm font-medium text-richblack-50'>{course.courseName}</p>
                                            <div className='mt-1 md:space-x-2 md:flex'>
                                                <p className='text-xs font-medium text-richblack-300'>
                                                    {course.studentEnrolled.length} Students
                                                </p>
                                                <p className='hidden md:block text-xs font-medium text-richblack-300'>|</p>
                                                <p className='text-xs font-medium text-richblack-300'>
                                                    Rs {course.price}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='mt-20 rounded-md bg-richblack-800 p-6 py-20'>
                        <p className='text-center text-2xl font-bold text-richblack-5'>You have not created any course yet</p>
                        <Link to="/dashboard/addCourse">
                            <p className='mt-1 text-center text-lg font-semibold text-yellow-50'>Create a Course</p>
                        </Link>
                    </div>
                )}
            </div>
        </div>
  )
}

export default Instructor