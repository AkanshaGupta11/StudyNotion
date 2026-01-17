import React, { useState } from 'react'
import { Chart, registerables } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(...registerables);

function InstructorChart({courses}) {
    //konsa chart show krna --> student ki income --> flag 
    const [currChart , setCurrChart] = useState("student");

    //random colors 
    const randomColors = (numColors) => {
        const colors = [];
        for(let i = 0 ; i<numColors ; i++){
            const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random()*256)},
            ${Math.floor(Math.random() * 256)})`

            colors.push(color);

        }

        return colors;
    }

    //create data for chart displaying student info 

    const chartDataForStudents = {
        labels: courses.map((course) => course.courseName),
        datasets : [
            {
                data : courses.map((course) => course.totalStudentsEnrolled),
                backgroundColor: randomColors(courses.length),

            }
        ]
    }
    //create data for chart displaying income info
    const chartDataForIncome = {
        labels: courses.map((course) => course.courseName),

        datasets:[
            {
                data: courses.map((course) => course.totalAmountGenerated),
                backgroundColor: randomColors(courses.length),
            }
        ]
    }
    //options
    const options = {
        maintainAspectRatio : false,
    };

  return (
    <div className='flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6'>
        <p className='text-lg font-bold text-richblack-5'>Visualize</p>
        <div className='flex items-center space-x-4'>
        <button 
            onClick={() => setCurrChart('revenue')} 
            className={`px-2 py-2 rounded-md ${currChart === 'revenue' ? 'bg-richblack-900 text-yellow-100' : 'bg-richblack-800 text-richblack-100'}`}
        >
        Revenue
        </button>
        <button 
            onClick={() => setCurrChart('students')} 
            className={`px-2 py-2 rounded-md ${currChart === 'students' ? 'bg-richblack-900 text-yellow-100' : 'bg-richblack-800 text-richblack-100'}`}
         >
        Students
        </button>
        </div>

        <div className='relative mx-auto h-full w-full'>
            <Pie 
             data = {currChart === "students" ? chartDataForStudents : chartDataForIncome}
             options = {options}
            />
        </div>
    </div>
  )
}

export default InstructorChart