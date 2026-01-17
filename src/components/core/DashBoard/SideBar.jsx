import React from 'react'
import {sidebarLinks} from "../../../data/dashboard-links"
import { logout } from '../../../services/operations/authAPI'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import SideBarLink from './SideBarLink';
import { VscSignOut } from 'react-icons/vsc';
import { useState } from 'react';
import ConfirmationModal from '../../common/ConfirmationModal';
import { TiThMenu } from "react-icons/ti";

function SideBar({ showSidebar, setShowSidebar }) {

    const {user  , loading : profileLoading} = useSelector((state) => state.profile);

    //auth loading ki value 
    const {loading:authLoading} = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    //
    const [ConfirmationModalData, setConfirmationModalData] = useState(null)
    //starting mai data nhi hain ki confirmation odal mai ky show hona chahiye 
    if(profileLoading || authLoading){
        return(
            <div className='mt-10'>Loading...</div>
        )
    }
  return (
     <div className='relative text-white'>
            
            {/* 1. MAIN SIDEBAR CONTAINER (Desktop visibility is controlled by DashBoard.js margin) */}
            <div className={`
                /* Mobile: Off-canvas properties */
                ${showSidebar ? "translate-x-0" : "-translate-x-full"}
                transition-transform duration-300 fixed top-0 left-0 bottom-0 z-40 
                h-full min-w-[222px] flex-col bg-richblack-800 py-10
                
                lg:translate-x-0 lg:relative lg:flex 
                lg:h-[calc(100vh-3.5rem)] lg:border-r lg:border-r-richblack-700
            `}>

                <div className='flex flex-col'>
                    {/* 2. Mobile Close Button (at the top of the sidebar when open) */}
                    {showSidebar && (
                        <div className='flex justify-end p-4 lg:hidden'>
                            {/* Use a simple close icon like VscClose if you prefer, 
                                but VscMenu rotated often works too for closing */}
                            <TiThMenu className='text-3xl text-richblack-5 cursor-pointer' onClick={() => setShowSidebar(false)}/>
                        </div>
                    )}
                    
                    {
                        sidebarLinks.map((link) => {
                            if(link.type && user?.accountType !== link.type) return null;

                            return(
                                // Note: If clicking a link should close the mobile menu, you must pass setShowSidebar down to SideBarLink
                                <SideBarLink key = {link.id} link = {link} iconName={link.icon} />
                            )
                        })
                    }

                </div>
                {/* //horizontal line phir setting and logout  */}
                <div className='mx-auto mt-4 mb-6 h-[1px] w-10/12 bg-richblack-400'>
                    <div className='flex flex-col'>
                        <SideBarLink 
                            link = {{name:"Settings", path:'/dashboard/settings'}}
                            iconName = "VscSettingsGear"></SideBarLink>

                        {/* //logout btn  */}
                        <button
                            onClick={() => setConfirmationModalData(
                                {
                                text1 : "Are you sure ?",
                                text2 : "you will be logged out of account",
                                btn1Text: "Logout",
                                btn2Text : "Cancel",
                                btn1Handler : () => dispatch(logout(navigate)),
                                btn2Handler : () => setConfirmationModalData(null),
                                }
                            )}
                            className='text-sm font-medium text-richblack-300 mx-4 my-4'
                        >
                            <div className='flex items-center gap-x-2 p-4'>
                                <VscSignOut className='text-lg' />
                                <span>Logout</span>
                            </div>
                        </button>   
                    </div>
                </div>
            </div>
            
            {/* 3. MOBILE OVERLAY: Darkens background when sidebar is open */}
            {showSidebar && (
                <div 
                    className='fixed inset-0 bg-black opacity-60 z-30 lg:hidden'
                    onClick={() => setShowSidebar(false)}
                ></div>
            )}
            
            {/* // confirmation modal hain --> render krwa diya*/}
            {ConfirmationModalData && 
            <ConfirmationModal modelData = {ConfirmationModalData}/>}
        </div>


// MOBILE SIDEBARR 
  )
}

export default SideBar