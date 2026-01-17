import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import RenderSteps from '../AddCourse/RenderSteps'
import { getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';
import { setCourse, setEditCourse } from '../../../../slices/courseSlice';

function EditCourse() {
    const dispatch = useDispatch();
    //course id in param 
    const {courseId} = useParams();
    const {course} = useSelector((state) => state.course);
    const[loading,setLoading ] = useState(false);
    const {token} = useSelector((state) => state.auth);

    //course mai data kese aayega 
    useEffect(() => {
        const populateCourseDetails = async() => {
            setLoading(true);
            const result = await getFullDetailsOfCourse(courseId,token);
            if(result?.courseDetails){
                dispatch(setEditCourse(true));
                dispatch(setCourse(result?.courseDetails));
            }
            setLoading(false);
        }

        populateCourseDetails();
    },[])
    //if(loading){}
    if(loading){
        return (
            <p>Loading...</p>
        )
    }

  return (
    <div className='text-white'>
        <h1>Edit Course</h1>
        <div>
            {
                course ? (<RenderSteps/>) : (<p>Course Not Found</p>)
            }
        </div>

    </div>
  )
}

export default EditCourse;