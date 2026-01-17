import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import SideBar from '../components/core/DashBoard/SideBar';
import { useState } from 'react';
import { TiThMenu } from 'react-icons/ti';


function DashBoard() {
    const {loading : authLoading} = useSelector( (state) => state.auth)
    const {loading : profileLoading} = useSelector((state) => state.profile);
    const [showSidebar, setShowSidebar] = useState(false);

    //agr koi bhi ek load ho rha hogaa --> false return krna 
    if(profileLoading || authLoading){
        return (
            <div className='mt-10'>Loading</div>
        )
    }
  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)]'>

      <div className={`fixed top-[3.5rem] left-0 z-50 p-3 lg:hidden ${showSidebar ? "hidden" : "block"}`}>
                <TiThMenu
                    className='text-3xl text-richblack-900 bg-richblack-5 rounded-full p-1 cursor-pointer shadow-lg'
                    onClick={() => setShowSidebar(true)}
                />
      </div>

        <SideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>

        <div className='h-[calc(100vh-3.5rem)] flex-1 overflow-auto pt-10 '>
                <div className = 'py-10 px-6 lg:px-8 w-full mx-auto'>
                  <Outlet/>
                </div>
        </div>
    </div>
  )
}

export default DashBoard