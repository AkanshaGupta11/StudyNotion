// Homework
import React from 'react'
import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ChipInput = ({name, label, register, errors, setValue}) => {
    const [tags, settags] = useState([])
    const {editCourse, course} = useSelector((state) => state.course);

// in order to tell the form that this is a reequired field 
    useEffect(()=> {
        register(name, {
            required:true,
            // validate: (value) => value.length > 0
   
        });

        //if editcourse hua , to jho prev tags se unko dikhana padega , sath mai edit k option
        if(editCourse && course?.tag) {
            let currentTags = course.tag;

            // 1. If it is a JSON string, parse it
            if (typeof currentTags === "string") {
                try {
                    currentTags = JSON.parse(currentTags);
                } catch (error) {
                    console.error("Could not parse tags:", error);
                    currentTags = [];
                }
            }

            // 2. If it is now an array, set it
            if (Array.isArray(currentTags)) {
                settags(currentTags);
                setValue(name, currentTags);
            }
        }
    },[])

  return (
    <div>
        <label className='text-sm text-richblack-5' htmlFor={name}>{label}<sup className='text-pink-200'>*</sup></label>
        <div className='flex flex-wrap gap-2 m-2'>
            {
                tags?.map((tag, index) => (
                    <div key={index} className='m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5'>
                        <span className='text-richblack-5'>{tag}</span>
                        <button
                        type='button'
                        onClick={() => {
                            const updatedTags = [...tags];
                            updatedTags.splice(index, 1);
                            settags(updatedTags);
                            setValue(name, updatedTags);
                        }}
                        className='ml-2 text-richblack-5'>
                            <FaTimes/>
                        </button>
                        </div>
                ))
            }
    </div>
    <input
        type='text'
        id={name}
        placeholder='Press Enter or , to add a tag'
        className='form-style w-full'
        //This is the event handler that runs every time the user presses a key inside the input.
        onKeyDown={(e) => {
            if(e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                if(e.target.value) {
                    settags([...tags, e.target.value]);
                    setValue(name, [...tags, e.target.value]);
                    e.target.value = "";
                }
            }
        }}
    />
    {
        errors[name] && <span className='text-xs text-pink-200'>Tags are required</span>
        
    }

    </div>
  )
}

export default ChipInput;


///
//useeffect mai 
//if edit mai hain 
// tho kuch tags ki value already present hogi 
//course , editcourse = useSelector((state) => state.course)
//settags(JSON.parse(course.tags));
//setvalue(name , json.parse(course.tags));
