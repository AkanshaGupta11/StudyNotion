import React from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {AiOutlineShoppingCart} from "react-icons/ai"
import ProfileDropdown from "../core/Auth/ProfileDropDown"
import { useEffect, useState } from 'react'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import {IoIosArrowDown} from "react-icons/io"
import { TiThMenu } from "react-icons/ti";

function NavBar() {

    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const {totalItems} = useSelector((state) => state.cart);

    const [subLinks,setSubLinks] = useState([]);
    const [loading,setLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

     const fetchSublinks = async () => {
        setLoading(true);
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("catalog",result);
            console.log(result?.data?.allCategory);
            if (result?.data?.allCategory?.length > 0) {
                setSubLinks(result?.data?.allCategory);
            }
            localStorage.setItem("sublinks", JSON.stringify(result.data.allCategory));
            console.log(subLinks);
        } catch (error) {
            // setsublinks(JSON.parse(localStorage.getItem("sublinks")));
            // console.log("could not fetch sublinks",localStorage.getItem("sublinks"));
            console.log(error);
        }
        setLoading(false)
    }
    useEffect( () => {
        //api call
        fetchSublinks();
        console.log("sublinks",subLinks);
    },[])

    const location = useLocation();
    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }



    const MobileCatalogDropdown = ({ element }) => (
        <div className='flex flex-col'>
            <p className='text-richblack-50'>{element.title}</p>
            {/* Displaying sublinks directly */}
            <div className='flex flex-col gap-1 mt-2 pl-3'>
                {
                    subLinks?.length > 0 ? (
                        subLinks.map((subElement, subIndex) => (
                            <Link 
                                to={`/catalog/${subElement?.name.split(" ").join("-").toLowerCase()}`} 
                                key={subIndex} 
                                className="text-richblack-200 text-sm hover:text-richblack-50"
                                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                            >
                                {subElement?.name}
                            </Link>
                        ))
                    ) : (
                        <p className='text-richblack-400'>No categories found</p>
                    )
                }
            </div>
        </div>
    );
  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 bg-richblack-900 text-white'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
            <Link to= "/">
            <img src={logo} alt="" width={160} height = {42} />
            </Link>

            {/* // Nav Links */}
            <nav className='hidden md:block'>
            <ul className=' flex-row gap-x-6 text-richblack-25 gap-5 hidden md:flex'>
                        {
                            NavbarLinks?.map((element, index) => (
                                <li key={index} >
                                    {
                                        element.title === "Catalog" ? (<div className=' flex items-center group relative cursor-pointer'>
                                            <p>{element.title}</p>
                                            <IoIosArrowDown />

                                            <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]'>
                                                
                                                {/* this is for the triangle [above the rectangle box ]*/}
                                                <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5'></div>
                                                
                                                {
                                                    // ?. => Optional Chaining operator
                                                    subLinks?.length < 0 ? (<div>No categories found</div>) : (
                                                        subLinks?.map((element, index) => (
                                                            <Link to={`/catalog/${element?.name.split(" ").join("-").toLowerCase()}`} key={index} className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50" >
                                                                {/* //onClick={() => { dispatch(setProgress(30)) }} */}
                                                                <p className=''>
                                                                    {element?.name}
                                                                </p>
                                                            </Link>
                                                        ))
                                                    )
                                                }
                                            </div>
                                        </div>) : (

                                            <Link to={element?.path} >
                                                <p className={`${matchRoute(element?.path) ? " text-yellow-25" : " text-richblack-25 hidden md:block"}`} >
                                                    {element?.title}
                                                </p>

                                            </Link>
                                        //    onClick={() => { dispatch(setProgress(100)) }} 
                                        )
                                    }
                                </li>
                            ))
                        }
            </ul>
            </nav>
            

            
            {/* login sign
            up dashboard */}
            <div className='flex gap-x-4 items-center '>
                
                {
                    user && user?.accountType != "Instructor" && (
                        <Link to ="/dashboard/cart" className='relative'>
                            <AiOutlineShoppingCart className='size-6'/>
                            {
                                totalItems > 0 && (
                                    <span>
                                    {totalItems}
                                    </span>
                                )
                            }
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to ="/login" className='hidden md:block'>
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                Log in
                            </button>
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to ="/signup" className='hidden md:block'>
                        <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Sign Up
                            </button></Link>
                    )
                }

                {
                    token != null && <ProfileDropdown/>
                }

                <button 
                        className='md:hidden'
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <TiThMenu className='text-2xl text-white'/>
                </button>
            </div>
        </div>

        {isMobileMenuOpen && (
                <div className='absolute top-14 left-0 w-full bg-richblack-900 z-50 shadow-lg md:hidden'>
                    <ul className='flex flex-col gap-y-4 p-4 text-richblack-5'>
                        {/* Map links for mobile menu */}
                        {
                            NavbarLinks?.map((element, index) => (
                                <li key={index}>
                                    {
                                        element.title === "Catalog" ? (
                                            <MobileCatalogDropdown element={element} />
                                        ) : (
                                            <Link 
                                                to={element?.path} 
                                                className={`block py-2 ${matchRoute(element?.path) ? "text-yellow-25 font-semibold" : "text-richblack-50"}`}
                                                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                                            >
                                                {element?.title}
                                            </Link>
                                        )
                                    }
                                </li>
                            ))
                        }

                        {/* Mobile Login/Signup (If not logged in) */}
                        { token === null && (
                            <>
                                <Link to ="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className='w-full border border-richblack-700 bg-richblack-800 py-2 text-richblack-100 rounded-md mt-2'>
                                        Log in
                                    </button>
                                </Link>
                                <Link to ="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className='w-full border border-richblack-700 bg-richblack-800 py-2 text-richblack-100 rounded-md'>
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}
                    </ul>
                </div>
            )}

    </div>
  )
}

export default NavBar

// on basis of acc type --> navbar will change 
// user --> if token hain --> no login signup 
// if user --> profile drop down 
//user-> cart visible 