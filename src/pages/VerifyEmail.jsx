import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OtpInput from 'react-otp-input'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { signup } from '../services/operations/authAPI'
import { sendOtp } from '../services/operations/authAPI'

function VerifyEmail() {
    const {signupData, loading} = useSelector((state) => state.auth)
    const [otp,setOtp] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect (() => {
        if(!signupData) {
            navigate("/signup");
        }
    }, [])
    const handleOnSubmit = (e) => {
        e.preventDefault();
        if(!signupData) return;
        const payload = { ...signupData, otp, navigate };
        console.log("SIGNUP PAYLOAD:", payload);
        dispatch(signup(payload));
    }
  return (
    <div className='text-white  flex items-center justify-center'>
        {
            loading ? (
                <div className=" h-[100vh] flex justify-center items-center"><div class="custom-loader"></div></div>
            ) : (
                <div className='min-h-[calc(100vh-3.5rem)] grid place-items-center'>
                     <div className='max-w-[500px] p-4 lg:p-8'>
                    <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">Verify Email</h1>
                    <p  className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">A verification code has been sent to you. Enter the code below</p>
                    <form onSubmit={handleOnSubmit}>
                        <OtpInput
                             value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                renderSeparator={<span>-</span>}
                                inputStyle="w-[20px] rounded-[8px] border-[1px] border-richblack-500 text-[3rem] text-center"
                                focusStyle="border-[5px] border-red-500"
                                isInputNum={true}
                                shouldAutoFocus={true}
                                containerStyle="flex justify-between gap-4"
                                renderInput={(props) => <input {...props} />}
                            />

                        <button type ='submit' className="w-full bg-yellow-200 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900">
                            Verify Email
                        </button>
                    </form>
                    </div>
                    <div>
                        <Link to = "/login">
                        <p>Back to Login</p>
                        </Link>

                        <button onClick={() => dispatch(sendOtp(signupData?.email,navigate))}>
                            Resend it
                        </button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default VerifyEmail