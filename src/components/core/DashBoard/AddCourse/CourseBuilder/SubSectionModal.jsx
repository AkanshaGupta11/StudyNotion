import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import { RxCross1 } from 'react-icons/rx';
import IconBtn from '../../../../common/IconBtn';
import Upload from './Upload';

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

    const handleEditSubSection = async (data) => {
        const currValues = getValues();
        console.log("currval",currValues);
        const formData = new FormData();
        formData.append("sectionId" , modalData.sectionId);
        formData.append("SubSectionId",modalData._id);

        if(isFormUpdated()){
            if(currValues.lectureTitle !== modalData.title){
                formData.append("title",data.lectureTitle);
            }
            if(currValues.lectureDesc !== modalData.description){
                formData.append("description",data.lectureDesc);
            }

            if(currValues.lectureVideo !== modalData.videoUrl){
                console.log("lecturVideo",currValues.lectureVideo)
                formData.append("video",data.lectureVideo);
            }
        }

        setLoading(true);

        //api call 
        const result = await updateSubSection(formData,token, );
        console.log(result);
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
                handleEditSubSection(data);
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
    <div className='fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
        <div className='my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800'>
            <div className='flex items-center justify-between rounded-t-lg bg-richblack-700 p-5'>
                <p className='text-xl font-semibold text-richblack-5'>{
                    view && "Viewing Lecture"} {add && "Adding Lecture"} {edit && "Editing Lecture"}</p>
                    {/* //AGR load hogya hoga tho hi --> modal close  */}
                    <button onClick={() => (!loading ? setModalData(null) :{})}>
                        <RxCross1  size={20} color={"white"} />
                    </button>
            </div>

            <form onSubmit = {handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
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

                <div className='flex flex-col space-y-2'>
                    <label lassName='text-sm text-richblack-5' htmlFor='lecture'>Lecture Title</label>
                    <input
                    disabled={view}
                    id ='lectureTitle'
                    placeholder='Enter Lecture Title'
                    {...register("lectureTitle",{required:true})}
                    className = 'w-full' />

                    {errors.lectureTitle && 
                    <span className='ml-2 text-xs tracking-wide text-pink-200'>Lecture Title is required</span>
                    }
                </div>
                <div className='flex flex-col space-y-2'>
                    <label className='text-sm text-richblack-5'>Lecture Description</label>
                    <textarea  disabled={view}
                        id = 'lectureDesc'
                        placeholder = 'Enter Lecture Description'
                        {...register("lectureDesc" , {required:true})}
                        className='form-style resize-x-none min-h-[130px] w-full'
                    />

                    {errors.lectureDesc && 
                    <span className='ml-2 text-xs tracking-wide text-pink-200'>Lecture Description is required</span>}
                </div>

                {/* //view -> no btn ,, add -> save ,, edit --> save changes  */}

                {
                    !view && (
                        <div className='flex justify-end'>
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