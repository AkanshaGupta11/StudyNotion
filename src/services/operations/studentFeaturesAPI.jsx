import { apiConnector } from "../apiconnector";
import { studentEndpoints } from "../apis";
import { toast } from "react-hot-toast";
import rzplogo from "../../assets/Images/rzp.png";
import { resetCart } from "../../slices/cartSlice";
import { setPaymentLoading } from "../../slices/courseSlice";




const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;




function loadScript (src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}


export async function buyCourse (token, courses, userDetails, navigate, dispatch) {
    // console.log("buyCourse -> courses",process.env.REACT_APP_BASE_URL)
    const toastId = toast.loading("Please wait while we redirect you to payment gateway", {
      position: "bottom-center",
      autoClose: false,
    });
    try {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
        }
        //initiate order
    const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, {courses},{
        Authorization: `Bearer ${token}`,
    })

    if(!orderResponse.data.success){
        toast.error(orderResponse.data.message)
        console.log("buyCourse -> orderResponse", orderResponse)
        toast.dismiss(toastId);
        return
    }
    console.log("buyCourse -> orderResponse", orderResponse)


    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        currency: orderResponse.data.currency,
        amount: orderResponse.data.amount.toString(),
        order_id: orderResponse.data.orderId,
        name: "Study Notion",
        description: "Thank you for purchasing the course",
        image: rzplogo,
        //
        prefill: {
            name: `${userDetails.firstName} ${userDetails?.lastName}` ,
            email: userDetails?.email,
        },

        //payment successful --> will call handler 
        handler: async function (response) {
            console.log("buyCourse -> response", response)
            sendPaymentSuccessEmail(response,orderResponse.data.amount,token);
            verifypayment({...response,courses}, courses,token,navigate,dispatch);
        },
        theme: {
            color: "#686CFD",
        },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
        toast.error("Payment Failed");
    });
    toast.dismiss(toastId);

    } catch (error) {
        
        toast.error("Something went wrong");
        console.log("buyCourse -> error", error)
    }
    toast.dismiss(toastId);
}



async function sendPaymentSuccessEmail (response,amount,token) {
    // const data = {
    //     amount,
    //     paymentId: response.razorpay_payment_id,
    //     orderId: response.razorpay_order_id,
    //     signature: response.razorpay_signature,
    // };

    
    const res = await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API,{
        amount,
        paymentId:response.razorpay_payment_id,
        orderId:response.razorpay_order_id,
    }, {
        Authorization: `Bearer ${token}`,
    });
    if (!res.success) {
        console.log(res.message);
        toast.error(res.message);
    }
}

async function verifypayment (bodyData,courses,token,navigate,dispatch,) {
    const toastId = toast.loading("Please wait while we verify your payment");
    console.log("verifypayment -> courses", courses);
    dispatch(setPaymentLoading(true));
    try{
        // const data = {
        //     amount: response.amount.toString(),
        //     paymentId: response.razorpay_payment_id,
        //     orderId: response.razorpay_order_id,
        //     signature: response.razorpay_signature,
        // };
        const res = await apiConnector("POST", COURSE_VERIFY_API,bodyData,{
            Authorization: `Bearer ${token}`,
        });
        console.log("res",res);
        console.log("verifypament -> res", res)
        if (!res.data.success) {
            toast.error(res.message);
            throw new Error(response.data.message)
            return;
        }

        toast.success("Payment Successfull");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }
    catch(err){
        toast.error("Payment Failed");
        console.log(err);
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false))
}


// {
            // razorpay_payment_id: response.razorpay_payment_id,
            // razorpay_order_id: response.razorpay_order_id,
            // razorpay_signature: response.razorpay_signature,
            // courses:courses.courses || courses,
        // }, 