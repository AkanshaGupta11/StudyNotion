import { createSlice } from "@reduxjs/toolkit";


//When the app starts, check if the user is already logged in from a previous session. If they are, grab their token. If not, set their token to null.
const initialState = {
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
    loading :false,
    signupData : null,
    
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setToken(state, value) {
            state.token = value.payload
        }
    }
});


export const { setToken, setLoading, setSignupData } = authSlice.actions;
export default authSlice.reducer;