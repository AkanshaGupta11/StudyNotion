import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import ReactStars from 'react-stars'
import { createRating } from '../../../services/operations/courseDetailsAPI'
import IconBtn from '../../common/IconBtn'
import { RxCross2 } from 'react-icons/rx'
import { useParams } from 'react-router-dom'


function CourseReviewModal({setReviewModal}) {
    const {user} = useSelector((state) => state.profile)
    const {token} = useSelector((state) => state.auth)
    const {courseEntireData} = useSelector((state) => state.viewCourse)
    const {courseId} = useParams();

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState :{errors},
    } = useForm();

    useEffect(() => {
        setValue("courseExperience","");
        setValue("courseRating",0);
    },[])
    const onSubmit = async(data) => {
        await createRating(
            {
                courseId: courseEntireData._id,
                rating:data.courseRating,
                review:data.courseExperience
            },
            token
        );
        setReviewModal(false);
    }

    const ratingChange = (newRating) => {
        setValue("courseRating", newRating)
    }
  return (
    <div>
        <div className=' z-50 my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800 fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2'>
            {/* Modal header  */}
            <div className='flex items-center justify-between rounded-t-lg bg-richblack-700 p-5'>
                <p className='text-xl font-semibold text-richblack-5'>Add Review</p>
             <button>
            <RxCross2 onClick={()=>{setReviewModal(false)}} className=' text-xl text-richblack-25'/>
            </button>
            </div>

            {/* modal body  */}
            <div className='p-5'>
                <div className='flex items-center justify-center gap-x-4'>
                    <img src= {user?.image} alt="" 
                    className='aspect-square w-[50px] rounded-full object-cover'/>

                    <div>
                        <p  className='font-semibold text-richblack-5'>{user?.firstName} {user?.lastName}</p>
                        <p className='text-sm text-richblack-5'>Posting Pubicly</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}
                className='mt-6 flex flex-col items-center'>
                    <ReactStars 
                    count ={5}
                    onChange ={ratingChange}
                    size ={24}
                    activeColor = "#ffd700"></ReactStars>
                    <input value={getValues().courseRating} {...register("courseRating", { required: true })} type="hidden" />
            {errors.courseRating && <span className='text-pink-200 text-[11px]'>* Please provide your rating</span>}
                    <div className='flex w-11/12 flex-col space-y-2'>
                        <label htmlFor="courseExperience" className='text-sm text-richblack-5'>Add Your Experience  <span className='text-pink-200'>*</span></label>
                        <textarea name="" id="courseExperience"
                        placeholder='Add Your Experience here'
                        {...register("courseExperience",{required:true})}
                        className='form-style resize-x-none min-h-[130px] w-full'>

                        </textarea>

                        {
                            errors.courseExperience && (
                                <span>Please Add your experience</span>
                            )
                        }
                    </div>
                    {/* cancel and save btn  */}
                     <div className='mt-6 flex w-11/12 justify-end gap-x-2'>
              <button onClick={()=>{setReviewModal(false)}} className='px-4 py-2 rounded-lg text-sm font-medium bg-richblack-300'>Cancel</button>
              <button type='submit' className='px-4 py-2 rounded-lg text-sm font-medium text-black  bg-yellow-200'>Submit</button>
            </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default CourseReviewModal