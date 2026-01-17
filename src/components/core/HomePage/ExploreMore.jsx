import React from 'react'
import { useState } from 'react';
import {HomePageExplore} from "../../../data/homepage-explore"
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';
const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
]
function ExploreMore() {
    const[currentTab, setCurrentTab] = useState(tabsName[0]);
    const[courses,setCourses] = useState(HomePageExplore[0].courses);
    const[currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards = (value) =>{
        setCurrentTab(value);
        const result = HomePageExplore.filter((course) => course.tag === value);
        console.log("result",result);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
        console.log(result[0].courses);
    }
  return (
    <div>
        <div className='text-3xl font-semibold text-center lg:text-4xl'>
            Unlock the 
            <HighlightText text={"Power of Code"}></HighlightText>
        </div>
        <p className='text-center text-richblack-300 text-md text-[16px] mt-3'>
            Learn to build anything you can imagine
        </p>
        <div className='flex flex-row rounded-full bg-richblack-800 mb-5 mt-5 px-1 py-1 border-richblack-100'>
            {
                tabsName.map((elm,index) => {
                    return (
                        <div className={`lg:text-[16px] text-[13px] flex flex-row items-center gap-2 
                        ${currentTab === elm ? "bg-richblack-900 text-richblack-5 font-medium" : "text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-5 py-2`} key ={index}
                        onClick = {() => setMyCards(elm)}>
                            {elm}
                        </div>
                    )
                })
            }
        </div>

        {/* <div className='lg:h-[150px]'></div> */}

        {/* course card group  */}
        <div className=' flex gap-9 w-full justify-center mt-5 mb-7 flex-wrap lg:absolute right-0 left-0 mr-auto ml-auto'>
            {
                courses.map((element,index) => {
                    return(
                        <CourseCard
                        key ={index}
                        cardData = {element}
                        currentCard = {currentCard}
                        setCurrentCard = {setCurrentCard} />
                    )
                })
            }
        </div>
    </div>
  )
}

export default ExploreMore