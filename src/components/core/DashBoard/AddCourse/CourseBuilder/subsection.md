import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import { RxCross1 } from 'react-icons/rx';
import IconBtn from '../../../../common/IconBtn';
import Upload from "../CourseInformation/Upload";

const SubSectionModal = ({
     modalData,
    setModalData,
    add = false,
    view = false,
    edit = false,
}) => {

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
        getValues,
    } = useForm();

    const dispatch = useDispatch();
    const [loading , setLoading] = useState(false);
    const {course} = useSelector ((state) => state.course);
    const {token} = useSelector((state) => state.auth);
    console.log("modaldt",modalData);
    useEffect (() => {
        if(view || edit){
            setValue("lectureTitle", modalData.title || "");
            setValue("lectureDesc" ,modalData.description || "");
            setValue("lectureVideo", modalData.videoUrl || "");
        }
    },[view, edit]);

    const isFormUpdated = () => {
        const currValues = getValues();
        
            if((currValues.lectureTitle !== modalData.title) ||
            (currValues.lectureDesc !== modalData.description) ||
            (currValues.lectureVideo !== modalData.videoUrl)){
                return true;
            }
            return false;

        
    }

    const handleEditSubSection = async () => {
        const currValues = getValues();
        const formData = new FormData();
        formData.append("sectionId" , modalData.sectionId);
        formData.append("SubSectionId",modalData._id);

        if(isFormUpdated()){
            if(currValues.lectureTitle !== modalData.title){
                formData.append("title",currValues.lectureTitle);
            }
            if(currValues.lectureDesc !== modalData.description){
                formData.append("description",currValues.lectureDesc);
            }

            if(currValues.lectureVideo !== modalData.videoUrl){
                console.log("lecturVideo",currValues.lectureVideo)
                formData.append("video",currValues.lectureVideo);
            }
        }

        setLoading(true);

        //api call 
        const result = await updateSubSection(formData,token, );
        if(result){
            const updatedCourseContent = course.courseContent.map((section) => section._id === modalData.sectionId ? result : section);
            const updatedCourse = {...course,courseContent : updatedCourseContent};
            dispatch(setCourse(updatedCourse));
        }

        setModalData(false);
        setLoading(false);
    }
    const onSubmit = async (data) =>{

        ////vie mai tho kuch submit k opt ni hoga 
        if(view)
            return;

        if(edit){
            if(!isFormUpdated()){
                toast.error("No changes made to the form");
            }
            else{
                //edit krdo 
                handleEditSubSection();
            }
            return;
        }

        //create 
        const formData = new FormData();

        formData.append("sectionId" , modalData);
        formData.append("courseId",course._id);
        formData.append("title" , data.lectureTitle);
        formData.append("description" , data.lectureDesc);
        formData.append("video",data.lectureVideo);

        console.log("Printing FormData Content:");
for (const pair of formData.entries()) {
  console.log(pair[0] + ', ' + pair[1] + ',' + pair[2]);
}
        setLoading(true);

        //API CALL 
        console.log("formDt",formData);
        const result = await createSubSection(formData,token);
        console.log("createSubSection",result);
        if(result){
            //TODO : --> Updation if any required 
            // const updatedCourseContent = course.courseContent.map((section) => section._id === modalData ? result : section)
            // const updatedCourse = {...course,updatedCourseContent}
            // console.log(updatedCourse);
            dispatch(setCourse(result));
        }

        //modal ko bnd krna
        setModalData(null);
        setLoading(false);

    }

  return (
    <div>
        <div>
            <div>
                <p>{
                    view && "Viewing Lecture"} {add && "Adding Lecture"} {edit && "Editing Lecture"}</p>
                    {/* //AGR load hogya hoga tho hi --> modal close  */}
                    <button onClick={() => (!loading ? setModalData(null) :{})}>
                        <RxCross1/>
                    </button>
            </div>

            <form onSubmit = {handleSubmit(onSubmit)}>
                {/* //upload waala , jha video dikh rhi  */}
                <Upload 
                name ="lectureVideo"
                label = "Lecture Video"
                register = {register}
                setValue = {setValue}
                errors = {errors}
                video = {true}
                //agr view or edit nhi hain  --> tho vho normal upload waala milega 
                viewData = {view ? modalData.videoUrl : null}
                editData = {edit ? modalData.videoUrl : null}
                ></Upload>

                <div>
                    <label >Lecture Title</label>
                    <input
                    id ='lectureTitle'
                    placeholder='Enter Lecture Title'
                    {...register("lectureTitle",{required:true})}
                    className = 'w-full' />

                    {errors.lectureTitle && 
                    <span>Lecture Title is required</span>
                    }
                </div>
                <div>
                    <label>Lecture Description</label>
                    <textarea 
                        id = 'lectureDesc'
                        placeholder = 'Enter Lecture Description'
                        {...register("lectureDesc" , {required:true})}
                        className='w-full min-h-[130px]'
                    />

                    {errors.lectureDesc && 
                    <span>Lecture Description is required</span>}
                </div>

                {/* //view -> no btn ,, add -> save ,, edit --> save changes  */}

                {
                    !view && (
                        <div>
                            <IconBtn
                                text = {loading? " Loading..." : edit ? "Save Changes" : "Save"} />
                        </div>
                    )
                }

            </form>
        </div>
    </div>
  )
}

export default SubSectionModal



import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { getUserCourses } from '../../../services/operations/profileAPI.jsx';

import ProgressBar from "@ramonak/react-progress-bar"

import { useNavigate } from 'react-router-dom';



function EnrolledCourses() {

    const {token} = useSelector((state) => state.auth);



    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const [progressData, setProgressData] = useState(undefined);

    const [Loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();



    const getEnrolledCourses = async() => {

        setLoading(true);

        try{

            const response = await getUserCourses(token,dispatch);

            console.log("response",response);

            setEnrolledCourses(response?.courses);

            setProgressData(response?.courseProgress);

        }

        catch(error) {

            console.log("unable to fetch enrolled courses");

        }

        setLoading(false);





    }

   const totalNoOfLectures = (course) => {
        let total = 0;
        course.courseContent.forEach((section) => {
            total += section.subSection.length;
        });
        return total;
    }

    useEffect(() => {

        getEnrolledCourses();



    },[]);

   

    if (Loading) {

        return (

            <div className='flex h-[calc(100vh)] w-full justify-center items-center'>

                <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-richblack-500'></div>

            </div>

        )

    }



  return (

    <div className='mx-auto w-11/12 max-w-[1000px] py-10'>

        <div className='text-3xl text-richblack-50'>

            Enrolled Courses

        </div>

        {

            !enrolledCourses ? (

                <div>

                    Loading...

                </div>

            ) : (

                !enrolledCourses.length ? (

                   

                    <div className='grid h-[10vh] w-full place-content-center text-richblack-5'>You have not enrolled in any course</div>

                ) : (

                    <div className='my-8 text-richblack-5'>

                        <div className='hidden md:flex rounded-t-lg bg-richblack-700 text-richblack-50 uppercase text-sm font-medium'>

                            <p className='w-[45%] px-5 py-3'>Course Name</p>

                            <p className='w-1/4 px-2 py-3'>Durations</p>

                            <p className='flex-1 px-2 py-3'>Progress</p>

                        </div>



                        {/* cards bnao  */}
                        
                        {

                            enrolledCourses.map((course,index) => (

                                <div key = {course._id || index}  onClick={() => {

                                            navigate(`view-course/${course._id}/section/${course.courseContent[0]._id}/sub-section/${course.courseContent[0].subSection[0]}`)

                                        }}

                                            className='flex items-center border border-richblack-700 rounded-none'>

                                    <div className='flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3'>

                                        {/* //thumbnail */}

                                        <img src ={course.thumbnail} alt ="thumbnail"

                                        className='h-14 w-14 rounded-lg object-cover'/>

                                        <div className='flex max-w-xs flex-col gap-2'>

                                            <p className='font-semibold'>{course.courseName}</p>

                                            <p className='text-xs text-richblack-300 hidden md:block'>{course.courseDescription}</p>

                                        </div>

                                    </div>

                                <div className='w-1/4 px-2 py-3'>

                                    {course?.totalDuration || "2h 30m"}

                                </div>



                                <div className='flex w-1/5 flex-col gap-2 px- py-3'>

                                    {

                                        progressData?.map((progress, index) => {

                                        //show 0 progress if no progress data is available

                                        if (progress?.courseID === course?._id) {

                                        return (

                                            <div key={index}>

                                            <p>Completed: {progress?.completedVideos?.length} / {totalNoOfLectures(course)}</p>

                                            <ProgressBar

                                            completed={progress?.completedVideos?.length / totalNoOfLectures(course) * 100}

                                            total={progress?.total}

                                            height='8px'

                                            isLabelVisible={false}

                                            />

                                            </div>

                                            )

                                            }

                                            return null;

                                        }

                                    )

                                }

                                            </div>

                                </div>

                            ))

                        }

                    </div>

                )

            )

        }



    </div>

  )

}



export default EnrolledCourses