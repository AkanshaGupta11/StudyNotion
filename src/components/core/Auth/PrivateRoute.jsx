import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

function PrivateRoute({children}) {

    const {token} = useSelector((state) => state.auth);

    if(token !== null){
        return children;
    }
    else{
        return <Navigate to = "/login" />
    }
  
}

export default PrivateRoute

//if user nhi hain logged in ---> can't access dashboard page --> go to login page 
