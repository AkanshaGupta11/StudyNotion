import React, { useEffect } from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';
import IconBtn from '../../../../common/IconBtn';
import {BiAddToQueue} from "react-icons/bi"

function CourseBuilderForm() {

    const {
        register,
        handleSubmit,
        setValue,     
        formState:{errors}
    } = useForm();

    const {course} = useSelector((state) => state.course);
    const [editSectionName , seteditSectionName] = useState(null);
    const dispatch = useDispatch();
    const [loading , setLoading] = useState(false);
    const {token} = useSelector((state) => state.auth);
    const cancelEdit = () => {
        // edit cancel krdiye 
        seteditSectionName(null);
        setValue("sectionName","");
    }

    //ab app step 2 se step 1 mai jaa rhe --> tho obvious ki app edit kroge course , create nhi 
    const goBack = () => {
        dispatch(setStep(1));
        dispatch(setEditCourse(true));
    }

    //next page mai jaana kb jaa skte 
    //when atleast onesection added
    //vlidation lgao , bina video k section kon dekhe ga
    const gotoNext = () =>{
        if(course.courseContent.length === 0){
            toast.error("Please atleast add one section");
            return;
        }

        if(course.courseContent.some((section) => section.SubSection.length === 0)){
            //if SubSection ki length is 0 
            toast.error("Atleast add one lecture in each section");
            return;
        }

        //if everything good --> go to next step 
        dispatch(setStep(3));
        
    }

    // useEffect(() => {
    //     console.log(course?.courseContent);
    // },[]);
    const onSubmit = async(data) => {
        //ya tho edit   --> / ya tho create 
        setLoading(true);
        let result;
        if(editSectionName){
            result = await updateSection(
                {
                    sectionName : data.sectionName,
                    sectionId : editSectionName,
                    courseId : course._id,
                } , token
            )
        }
        else{
            result = await createSection({
                sectionName : data.sectionName,
                sectionId: editSectionName,
                courseId : course._id,

            },token)
            console.log("result",result);
        }

        //update valyes 
        if(result){
            //section add krne se course value bhi change huii 
            console.log("re2",result);
            dispatch(setCourse(result));
            console.log("hello");
            seteditSectionName(null);
            setValue("sectionName","")
        }

        //loading false
        setLoading(false);

    }
// section mai btn mai click krne se course builder mai updation ho rhi hin 
    const handleChangeEditSectionName = (sectionId, sectionName) => {

        if(editSectionName === sectionId){
            cancelEdit();
            // if already section hain --. ab click krne pr editsection -> will become null 
            return;
        }
        seteditSectionName(sectionId);
        setValue("sectionName",sectionName);
    }
  return (
        // 1
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">Course Builder </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="text-sm text-richblack-5" htmlFor="sectionName">Section name <sup className="text-pink-200">*</sup></label>
                <input 
                id ='sectionName'
                placeholder= "Add section name"
                {...register('sectionName',{required:true})} 
                className="form-style w-full"/>

                {errors.sectionName && 
                <span className="ml-2 text-xs tracking-wide text-pink-200">Section Name is required</span>}
            </div>
            
            {/* 2--->//if edit hota tho edit course // create section  */}
            <div className="flex items-end gap-x-4">
                <IconBtn type = "submit"

                text = {
                    editSectionName ? "Edit Section Name" : "Create Section"
                }
                outline = {true}
                customClasses={"flex items-center border border-yellow-50 bg-transparent cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"}></IconBtn>

                <BiAddToQueue className = "text-white" size ={20}/>

                {
                    editSectionName && 
                    <button type = 'button'
                    onClick = {cancelEdit}
                    className='text-sm text-richblack-300 underline'>Cancel Edit</button>
                }
            </div>
        </form>

        {/* //nested section kb dikhana 
        course mai coursecontent mai --> section hain -> section mai SubSection  */}
        {
            course.courseContent.length > 0 && (
                <NestedView handleChangeEditSectionName = {handleChangeEditSectionName}/>
            )
        }

        <div className='flex justify-end gap-x-3'>
            <button onClick = {goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900">
                Back
            </button>

             <button
                    onClick={gotoNext}
                    className="flex items-center bg-yellow-200 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined"
                >
                    <span className="false text-white">Next</span>
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                    </svg>
                </button>
        </div>
    </div>
  )
}

export default CourseBuilderForm