import { AiTwotoneWarning } from "react-icons/ai";
import { setLoading, setToken } from "../../slices/authSlice"
import { apiConnector } from "../apiconnector"
import {endpoints} from "../apis"
import {toast} from "react-hot-toast"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"

const {SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API ,
    RESETPASSWORD_API} = endpoints;


export function sendOtp(email,navigate) {
    return async (dispatch) => {
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("POST",SENDOTP_API,{
                email,
                checkUserPresent:true,
            })
            console.log("SENDOTP API RESPONSE............", response)

            console.log(response.data.success);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("OTP Sent successfully");
            navigate("/verify-email");
        }
        catch(error) {
            console.log("SENDOTP API EERROR..............",error)
            toast.error(error?.response?.data?.message)
        }
        dispatch(setLoading(false));
        
    }
}

export function signup(payload){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true));
    try{
        const{
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
            navigate
        } = payload;

        console.log("SIGNUP - sending body:", {accountType, firstName, lastName, email, password, confirmPassword, otp});
        const response = await apiConnector("POST", SIGNUP_API,{
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp
        })
        console.log("SIGNUP API RESPONSE............", response)
        console.log(otp);
        if (!response.data.success) {
        throw new Error(response?.data?.message || "Signup Failed") 
        
      }

      toast.success("Signup Successful")
      navigate("/login");
    }
    catch(error) {
    console.log("SIGNUP API ERROR............", error)
    toast.error(error?.response?.data?.message || "Signup Failed")
    dispatch(setLoading(false));
    // navigate?.("/signup");
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
    }
}

export function login(email,password,navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST" ,LOGIN_API ,{
                email,
                password
            })
            console.log("LOGIN API RESPONSE............", response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }
        toast.success("Login Successful")
        dispatch(setToken(response.data.token))

        const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
            //user 
      localStorage.setItem("user", JSON.stringify(response.data.user))
      localStorage.setItem("token", JSON.stringify(response.data.token))
        }
        catch(error){
            console.log("LOGIN API ERROR............", error)
            toast.error(error.response.data.message)
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}
export function getPasswordResetToken(email) {
    return async(dispatch) => {
        //jb tk backend ki call jaa rhi -> loading ko true krdo 
        //dispatch(setLoading(true)); //spinner loader dikhne lgega 
        try{
            const response = await apiConnector("POST",RESETPASSTOKEN_API,{email})
            console.log("RESET PASSWORD TOKEN RESPONSE.....",response);

            //chk succesful response 
            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Reset email sent");
            
            //dispatch(setLoading(false));
            return true;
        }
        catch(error){
            console.log("RESET PASSWORD TOKEN Error", error);
            toast.error("Failed to send email fro reseting password")
        }

        dispatch(setLoading(false));
    }
}

export function resetPassword(password,confirmPassword,token , navigate){
    return async(dispatch) => {
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("POST", RESETPASSWORD_API ,{password,confirmPassword , token});
            console.log("RESET PASS RESPONSE....",response);

            if(! response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Password has been reset successfull")
        }
        catch(err) {
            console.log("RESET PASSWORD TOKEN ERROR",err);
            toast.error("Unable to reset Password");
        }
        dispatch(setLoading(false));
        navigate("/login");
    }
}


export function logout(navigate) {
    return (dispatch) => {
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart())

        localStorage.removeItem("token")
        localStorage.removeItem("user")

        toast.success("Logged out")

        navigate("/");
    }
}