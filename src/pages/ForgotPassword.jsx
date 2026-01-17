import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getPasswordResetToken } from '../services/operations/authAPI';


function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [emailSent , setEmailSent] = useState(false);
    const [email,setEmail] = useState("");
    console.log(loading);
    const dispatch = useDispatch();
    const handleOnSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        const result = await dispatch(getPasswordResetToken(email));
        console.log("result",result);
        if(result) {
            setEmailSent(true);
        }
        setLoading(false);
        console.log("emailsent",emailSent);
    }

   
  return (
    <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
        
        {
            loading ? (
                <div class="custom-loader"></div>
            ) : (
                <div  className='max-w-[500px] p-4 lg:p-8'>
                    <h1 className='text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5'>
                        {
                            !emailSent ? "Reset your Password" : "Check Your Email"
                        }
                    </h1>

                    <p className='my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100'>
                        {
                            !emailSent ? ("Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery") : (`We have sent the reset email to ${email}`)
                        }
                    </p>

                    <form onSubmit={handleOnSubmit}>
                        {
                            !emailSent &&(
                                <label  className="w-full">
                                    <p  className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">Email Address <sup class="text-pink-200">*</sup></p>
                                    <input 
                                    type="email"
                                    required
                                    name = "email"
                                    placeholder='abc@gmail.com' 
                                    value = {email}
                                    onChange ={(e) => setEmail(e.target.value)}
                                    className="rounded-lg bg-richblack-700 p-3 text-[16px] leading-[24px] text-richblack-5 shadow-[0_1px_0_0] shadow-white/50 placeholder:text-richblack-400 focus:outline-none w-full"/>
                                </label>
                            )
                        }

                        <button type ="submit"
                        className='mt-6 w-full rounded-[8px] bg-yellow-200 py-[12px] px-[12px] font-medium text-richblack-900'>
                            {!emailSent ? "Reset Password" : "Resend email"}
                        </button>
                    </form>

                    <div className='mt-6 flex items-center justify-between'>
                        <Link to="/login">
                        <p className="flex items-center gap-x-2 text-richblack-5">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z"></path></svg>Back to Login
                        </p></Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default ForgotPassword