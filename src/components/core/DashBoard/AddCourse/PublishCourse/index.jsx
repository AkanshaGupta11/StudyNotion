import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { resetCourseState, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';
import IconBtn from '../../../../common/IconBtn';
import { useNavigate } from 'react-router-dom';

function PublishCourse() {
    const {register, handleSubmit , setValue , getValues} = useForm();
    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth);
    const {course} = useSelector((state)=>state.course);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        if(course?.status === COURSE_STATUS.PUBLISHED){
            setValue("public",true);
        }
    },[]);


    //public true mean checked unchecked box 
    const goToCourses = () => {
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses");
    }
    const handleCoursePublish = async() => {
        //if koi value change hi nhi ki , like koi updation nhi kiya 
        //tb api call ki koi utni zarurat ni 
        //published and box is checke 
        //draft and box not check 
        if(course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true ||
        (course.status === COURSE_STATUS.DRAFT && getValues("public") === false)) {
            //no update in form 
            ///no need to make api call 
            goToCourses();
            setLoading(false);
            dispatch(setStep(1));
            dispatch(setEditCourse(null));
            return;
           
        }

        //if form update 
        const formData = new FormData();
        formData.append("courseId",course._id);
        const courseStatus = getValues("public") ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT;
        formData.append("status",courseStatus);

        setLoading(true);
        const result = await editCourseDetails(formData,token);
        console.log("result",result);
        if(result){
            goToCourses();
        }
        setLoading(false);
    }
    const onSubmit = (data) => {
        handleCoursePublish(data);
    }

    const goBack = () => {
        dispatch(setStep(2));
        
    }
  return (
    <div className='rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>
        <p className='text-2xl font-semibold text-richblack-5' > Publish Course</p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='my-6 mb-8'>
            <label htmlFor="public" className="inline-flex items-center text-lg">
                <input 
                defaultChecked={false} 
                type="checkbox"
                id='public' 
                name = "public"
                    {...register("public")}
                className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"/>
                <span className="ml-2 text-richblack-400">Make this course as public</span>
            </label>
            </div>

            <div className="ml-auto flex max-w-max items-center gap-x-4">
                <button disabled={loading}
                type ='button'
                onClick={goBack}
                className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900">Back
                </button>

                <button disabled={loading} type='submit' className="flex items-center bg-yellow-200 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined">Save Changes</button>            
                </div>
            
        </form>
    </div>
  )
}

export default PublishCourse


//abhi tk draft mai the , ab publish 

