import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {RxDropdownMenu} from "react-icons/rx"
import {MdEdit} from "react-icons/md"
import {RiDeleteBin6Line} from "react-icons/ri"
import {BiDownArrow} from "react-icons/bi"
import {AiOutlinePlus} from "react-icons/ai"
import SubSectionModal from './SubSectionModal'
import ConfirmationModal from '../../../../common/ConfirmationModal'
import { deleteSubSection, deleteSection } from '../../../../../services/operations/courseDetailsAPI'
import { setCourse } from '../../../../../slices/courseSlice'



function NestedView({handleChangeEditSectionName}) {
    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [addSubSection , setAddSubSection] = useState(null);
    const [viewSubSection , setViewSubSection] = useState(null);
    const [editSubSection , setEditSubSection] = useState(null);
    const [confirmationModal , setConfirmationModal] = useState(null);

    const handleDeleteSection = async (sectionId) => {
        const result = await deleteSection({sectionId,courseId:course._id},token);
        /// major glti , delete section kr rhe or usko course mai update kr rhe 
        //ab section k data aa rha , tho phele tho course mai kro then phir setCourse kro 
        console.log("result.....",result);
        if(result) {
            dispatch(setCourse(result));
            setConfirmationModal(null);

        }

    }

    const handleDeleteSubSection = async(SubSectionId, sectionId) => {
        const result = await deleteSubSection({SubSectionId, sectionId,courseId:course._id},token);

        if(result){
            // extra ky kr skte :---
            const updatedCourseContent = course.courseContent.map((section) => section._id === sectionId ? result : section)
            const updatedCourse = {...course,courseContent :updatedCourseContent} 
            dispatch(setCourse(updatedCourse));
            setConfirmationModal(null);

        }

    }

    const sections = Array.isArray(course?.courseContent) ? course.courseContent : [];

    return (
      <div className='text-white'>
        <div className='rounded-lg bg-richblack-700 p-6 px-8'>
          {sections.length === 0 ? (
            <p className="text-sm text-richblack-300">No sections yet</p>
          ) : (
            sections.map((section) => (
              <details key={section._id} className="mt-4">
                <summary className='flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2'>
                  <div className='flex items-center gap-x-3'>
                    <RxDropdownMenu size={25} className=' text-richblack-50'/>
                    <p className='font-semibold text-richblack-50'>{section.sectionName}</p>
                  </div>

                  <div className='flex items-center gap-x-3'>
                    {/* //edit btn mai click --> upper create / edit mai change aata tha  */}
                    <button onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}>
                      <MdEdit className='text-lg text-richblack-50 '/>
                    </button>

                    <button onClick={() => setConfirmationModal({
                        text1:"Delete this Section",
                        text2:"All the lectures in this section will be deleted",
                        btn1Text:"Delete",
                        btn2Text :"Cancel",
                        btn1Handler : () => handleDeleteSection(section._id),
                        btn2Handler : () => setConfirmationModal(null),
                    })}>
                      <RiDeleteBin6Line className='text-lg text-richblack-50'/>
                    </button>

                    <span className="font-medium text-richblack-300">|</span>
                    <BiDownArrow className='text-lg text-richblack-50'/>
                  </div>
                </summary>

                <div className='px-6 pb-4'>
                  { Array.isArray(section?.SubSection) && section.SubSection.length > 0 ? (
                      section.SubSection.map((data) => (
                        <div
                          key={data?._id}
                          onClick={() => setViewSubSection(data)}
                          className='flex items-center justify-between gap-x-3 border-b-2 py-2'
                        >
                          <div className='flex items-center gap-x-3'>
                            <RxDropdownMenu  size={25} className=' text-richblack-50'/>
                            <p className='font-semibold text-richblack-50'>{data.title}</p>
                          </div>

                          <div 
                          onClick={(e) => e.stopPropagation()}
                          className='flex items-center gap-x-3'>
                            <button onClick={() => setEditSubSection({...data, sectionId: section._id})}>
                              <MdEdit className='text-lg text-richblack-50 z-50' />
                            </button>

                            <button onClick={() => setConfirmationModal({
                                text1:"Delete this SubSection",
                                text2:"current lecture will be deleted",
                                btn1Text:"Delete",
                                btn2Text :"Cancel",
                                btn1Handler : () => handleDeleteSubSection(data._id, section._id),
                                btn2Handler : () => setConfirmationModal(null),
                            })}>
                              <RiDeleteBin6Line className='text-lg text-richblack-50 z-50' size={21}/>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-richblack-300">No lectures yet</p>
                    )
                  }

                  <button onClick={() => setAddSubSection(section._id)}
                    className='mt-3 flex items-center gap-x-1 text-yellow-50 font-bold'>
                    <AiOutlinePlus className='text-lg text-yellow-50 '/>
                    <p>Add Lecture</p>
                  </button>
                </div>
              </details>
            ))
          )}
        </div>
          {/* //add mai click --> add waala modal  */}
        {addSubSection && (
          <SubSectionModal modalData={addSubSection} setModalData={setAddSubSection} add={true} />
        )}
        {/* view mai click , view waala modal  */}
        {viewSubSection && (
          <SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view={true} />
        )}
        {/* edit mai click edit waala modal  */}
        {editSubSection && (
          <SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true} />
        )}

        {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
      </div>
    )
}

export default NestedView




//deleteSubSection mai ky hua hain 
//SLICE BNA HAIN COURSE , 
//Course k andr section phir usmai SubSection 
//tumne frontend se call ki update SubSection ki 
//course k koisa section k subpart update hogya hoga 
//tho usne updatedsection k part return kiya 

//lekin course mai updation section se nhi course se hoga 
//updated course bnaya or phir feed kr diya 

//humlog course ko update krne k liye section bhej rhe the , bulki humko course hi bhejna tha 



// phele humne sirf backend bnaya tha , 
//lekin ab hum frontend k sath backend ko connect kr rhe hain 
//isliye kuch changes smjh aayenge 
//section , SubSection mai , 

//delete uodaate krte wqt UPDATED SECTION , SubSection , nhi bheja 