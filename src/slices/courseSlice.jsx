import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step: 1, // to change step number
  course: null, // to save course data 
  editCourse: false, // to toggle edit mode
  paymentLoading: false, // to show payment scene 
}

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload
    },
    setCourse: (state, action) => {
      state.course = action.payload
    },
    setEditCourse: (state, action) => {
      state.editCourse = action.payload
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload
    },
    resetCourseState: (state) => {
      state.step = 1
      state.course = null
      state.editCourse = false
    },
  },
})

export const {
  setStep,
  setCourse,
  setEditCourse,
  setPaymentLoading,
  resetCourseState,
} = courseSlice.actions

export default courseSlice.reducer


//course mai teen step n 
//course bnana , section wagera upload kr na , 
//publish krna 

//i need to build multi step add course wizard -> will have several steps 
//how will i know in which step user is 

//user ne data daala --> tho data kha jaayega --> store hoga 

// you don't "reset" the slice, the next time the user clicks "Add Course," the form will pop up showing their old, completed data (e.g., on Step 3) instead of a fresh, empty form (on Step 1).

// The resetCourseState reducer is called to wipe the slate clean and return the slice to its original, empty state, making it ready for the next time.