import React from 'react'
import { useSelector } from 'react-redux'
import CourseInformationForm from './CourseInformation/CourseInformationForm';
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm';
import PublishCourse from './PublishCourse/index';
import { FaCheck } from 'react-icons/fa';
function RenderSteps() {

    const {step} = useSelector((state) => state.course);
    const steps = [
        {
            id:1,
            title:"Course Information",
        },
        {
            id:2,
            title:"Course Builder",
        },
        {
            id:3,
            title:"Publish",
        }
    ]
  return (
    <>
    
    <div className=' flex justify-center items-center'>
        <div className=' flex flex-col w-[calc(100vw-20%)] md:w-fit items-start'>
           <div className=' ml-10 relative mb-2 flex w-full justify-center'> 
                {steps.map((item) => (
            //kb highlight krna kb nhi 
            
            <div key={item.id} className=' flex w-full justify-between'>
                <div className='flex flex-col items-center'>
                <div className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] 
                ${step === item.id ? "bg-yellow-900 border-yellow-50 text-yellow-50" 
                : "border-richblack-700 bg-richback-800 text-richblack-300"}`}>
            
            {/* agr vho step complete hojata tho tick waala icon aa jaata hain */}
            {/* item .id --> konsa jho step ho chuka hain  */}
            {
                step > item.id ? (<FaCheck/>) : (item.id)
            }

                </div>
            </div>
            {item.id < 3 && (
                <div className={`h-[calc(34px/2)] w-[100%]  border-dashed border-b-2 ${step > item.id ? "border-yellow-50" : "border-richblack-700"}}`}>
                </div>
            )}
            </div>
          
        ))}
    </div>

    <div className='relative mb-16 flex w-full select-none justify-between'>
        {steps.map((item) => (
            // title add kr diye 
            <>
            <div key={item.id} className='flex md:min-w-[180px] flex-col items-start'>
                <p className=' ml-3 md:ml-0 text-[10px] md:text-sm text-richblack-5'>{item.title}</p>
            </div>
            </>
        ))}
    </div>
</div>
</div>
    {/* //form  */}

    {step === 1 && <CourseInformationForm/>}
    {step === 2 && <CourseBuilderForm/>}
    {step === 3 && <PublishCourse/>}
    </>
  )
}

export default RenderSteps