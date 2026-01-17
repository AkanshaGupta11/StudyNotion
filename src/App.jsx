//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from "./pages/Home";
import NavBar from './components/common/NavBar';
import OpenRoute from "./components/core/Auth/OpenRoute";
import ForgotPassword from './pages/ForgotPassword';
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import UpdatePassword from './pages/updatePassword';
import VerifyEmail from './pages/VerifyEmail';
import About from './pages/About';
import MyProfile from './components/core/DashBoard/MyProfile';
import DashBoard from './pages/DashBoard';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import Error from './pages/Error';
import Settings from './components/core/DashBoard/Settings';
import EnrolledCourses from './components/core/DashBoard/EnrolledCourses';
import { ACCOUNT_TYPE } from './utils/constants';
import AddCourse from './components/core/DashBoard/AddCourse/index';
import { useDispatch, useSelector } from 'react-redux';
import ContactUs from './pages/ContactUs';
import MyCourses from './components/core/DashBoard/MyCourses'
import EditCourse from './components/core/DashBoard/EditCourse';
import Catalog from "./pages/Catalog"
import CourseDetails from './pages/CourseDetails';
import ViewCourse from './pages/ViewCourse';
import VideoDetails from './components/core/ViewCourse/VideoDetails'
import Cart from './components/core/DashBoard/Cart';
import Instructor from './components/core/DashBoard/InstructorDashboard/Instructor';

function App() {
   const {loading :authLoading} = useSelector((state) => state.auth);
   const {user,loading:profileLoading} = useSelector((state) => state.profile);
   const progress = useSelector ((state) => state.loadingBar);
   const dispatch = useDispatch();
  console.log(user?.accountType);
   if(authLoading || profileLoading){

    return(
      <div className="w-screen min-h-screen flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <NavBar/>
      <Routes>
        <Route path = "/" element = {<Home/>}></Route>
        <Route path="catalog/:catalogName" element = {<Catalog/>}></Route>
        <Route path ="/signup" element ={<OpenRoute><Signup/></OpenRoute>}></Route>
        <Route path = "/login" element = {<OpenRoute><Login/></OpenRoute>}/>
        <Route path = "/forgot-password" element ={
          <ForgotPassword></ForgotPassword>}/>
        <Route path = "/update-password/:token" element ={
          <UpdatePassword/>}/>

        <Route path = "/verify-email" element ={
          <VerifyEmail/>}/>
        
        <Route path = "/about" element ={
          <About/>}/>

        <Route path="/contact" element={<ContactUs />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path ="/dashboard"
        element = {
          <PrivateRoute>
            <DashBoard />
          </PrivateRoute>
        }
        >
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="settings" element={<Settings />} />

        {user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route path = "cart" element = {<Cart/>}/>
          <Route
          path="enrolled-courses"
          element={
          user?.accountType === ACCOUNT_TYPE.STUDENT
          ? (<EnrolledCourses />)
          : (<Home /> )// or a NotAuthorized component / <Navigate to="/"/> 
    }
  />

          </>
        )}

        {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
						<>
              <Route path="instructor" element ={<Instructor/>}/>
							<Route path="add-course" element={<AddCourse />} />
							<Route path="my-courses" element={<MyCourses />} />
							<Route
								path="edit-course/:courseId"
								element={<EditCourse />}
							/>
							{/* <Route
								path="dashboard/instructor"
								element={<InstructorDashboard />}
							/> */}
						</>
					)}
        
				</Route>   

        <Route element ={
          <PrivateRoute>
            <ViewCourse></ViewCourse>
          </PrivateRoute>
        }>

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
              <Route
              path ="view-course/:courseId/section/:sectionId/sub-section/:subsectionId"
              element={<VideoDetails/>}></Route>
              </>
            )
          }

        </Route>
        <Route path="*" element={<Home />} />   
      </Routes>
    </div>
  )
}

export default App
