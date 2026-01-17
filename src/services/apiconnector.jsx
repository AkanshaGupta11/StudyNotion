import axios from "axios" // import axios - js library 
//axios is special tol for sending and recieving mssg on internet 


export const axiosInstance = axios.create({}); // axios.create --> helper function, 
//instead of using main axios tool , we r making our own copy of axios // because we can add our special setting , without affecting the main file 

export const apiConnector = (method,url,bodyData,headers,params) => {
    return axiosInstance({
        method: `${method}`, // type of req - post , get 
        url:`${url}`, // website address 
        data : bodyData ? bodyData : null, // data u wanna send - new user detail 
        headers : headers ? headers : null, // instruction - this data in json 
        params: params ? params : null, //filyers 
    });
}


//instead of fetch we are using axios 
//


