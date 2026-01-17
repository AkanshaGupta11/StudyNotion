//sirf ek tab ki baat ho rhi 
//icon dikh rha , vertical border , or app 
import React from 'react'
import * as Icons from "react-icons/vsc"
// import { useDispatch } from 'react-redux';
import { matchPath, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

function SideBarLink({link,iconName}) {
  const Icon =  Icons[iconName];
  //match krne k liye location 
  const location = useLocation();
  //const dispatch = useDispatch();

  const matchRoute = (route) => matchPath(route , location.pathname);
  //recurssion jaisa code hoya hain 
    
  return (
    <NavLink
    to = {link.path}
    //ye mera bg k liye , agr path match ->tho bg light yellow 

    className = {` py-2 px-4 relative md:px-8 md:py-2 text-sm font-medium transition-all duration-300 ${matchRoute(link.path) ? "bg-yellow-800" : "bg-opacity-0"}`}>
      {/* //ye vho ptli si line --> agr match route --> opacity 100 vrna tho 0 */}
      <span className= {`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50
        ${matchRoute(link.path) ? "opacity-100" : "opacity-0"}`}></span>

        <div className='flex items-center gap-x-2'>
          <Icon className="md:text-lg text-3xl"/>
          <span className='hidden md:block'>{link.name}</span>
           
        </div>
    </NavLink>
  )
}

export default SideBarLink

//hidden --> mobile par(small screen) chupa rehta hain 
