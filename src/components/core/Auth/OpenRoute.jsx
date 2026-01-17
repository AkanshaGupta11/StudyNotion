import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function OpenRoute({children}) {
    const {token} = useSelector((state) => state.auth)
  
    if(token === null){
        return children;
    }
    else{
        return <Navigate to= "/dashboard/my-profile"/>
    }
}

export default OpenRoute


//i want that login sign up page not visible to users who are slready logged in 
//kese pta chlega logged in , token ki value se 
// his component solves this specific problem: "If a user is already logged in, but they manually type /login in the URL bar, what should happen?"

// Without this code: The user would see the login page again, which is confusing