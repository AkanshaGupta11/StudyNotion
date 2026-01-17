import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    user:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null, // such that user is logged in even if refresh the window 

    loading:false,

}

const profileSlice =createSlice({
    name:"profile",
    initialState: initialState,
    reducers:{
        setUser(state,value){
            state.user=value.payload
            localStorage.setItem("user",JSON.stringify(value.payload)); // local storage can only store string 
        },
        setLoading(state,value){
            state.loading = value.payload
        },
    }
});

export const {setUser,setLoading} = profileSlice.actions;
export default profileSlice.reducer;


// purpose ky hain 
//manage users personal data 
//refresh krne mai -> data gayab n ho 
// lobal source of truth 
// name , email ye sb jagah chahiye hoga 
// store , slice bnau {name:"useR", email:""}
//if not saved in local storae --> data will lost while we refresh 
