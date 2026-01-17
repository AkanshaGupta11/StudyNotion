import React from 'react'
import { Link } from 'react-router'

function Button({children , active, linkto}) {
    //children --> content /text
    //active hain ki nhi 
    //link to -> click krne pr where wil be directed
  return (
    <Link to={linkto}>
        <div className={`text-center text-[13px] px-6 py-3 rounded-md font-semibold
            ${active ? "bg-amber-300 text-black": "bg-richblack-800 "}
            hover:scale-95 transition-all duration-200`}>
            {children}
        </div>
    </Link>
  )
}

export default Button