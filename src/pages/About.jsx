import React from 'react'
import HighlightText from "../components/core/HomePage/HighlightText"
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
import Quote from '../components/core/About/Quote'
import FoundingStory from "../assets/Images/FoundingStory.png"
import StatsComponent from '../components/core/About/StatsComponent'
import LearningGrid from '../components/core/About/LearningGrid'
import ContactFormSection from '../components/core/About/ContactFormSection'
import Footer from "../components/common/Footer"
import ReviewSlider from '../components/common/ReviewSlider'


function About() {
  return (
    <div className='mx-auto text-white'>

        {/* SECTION 1 */}
        <section className='bg-richblack-700'>
            <div className='relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white'>
                <header className='mx-auto py-20 text-4xl font-semibold lg:w-[70%]'>Driving Innovation in Online Education for a 
                    <HighlightText text ={"Brighter Future"}/>
                    <p  className='mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]'>Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community</p>

                </header>
            <div className='sm:h-[70px] lg:h-[150px]'></div>
                <div className='absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5'>
                    <img src= {BannerImage1} alt="" />
                    <img src={BannerImage2} alt="" />
                    <img src={BannerImage3} alt="" />
                </div>
            </div>
        </section>

        {/* SECTION 2 */}
        <section className='border-b border-richblack-700'>
            <div className='mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500'>
             <div className='h-[100px] '></div>
                <Quote/>
            </div>
        </section>

        {/* SECTION 3 */}
        <section className='bg-richblack-900 text-richblack-5 py-20'>
            <div className='mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-17'>
               <div className ='flex flex-col items-center gap-24 lg:flex-row lg:gap-10'>
                {/* Founding story left box  */}
                <div className='flex flex-col gap-10 p-8 lg:w-[50%] '>
                    <h1 className='text-4xl font-semibold'>
                       <span className='bg-gradient-to-br from-[#FF512F] to-[#F09819] bg-clip-text text-transparent'>
                  Our Founding Story
                </span>
                </h1>
                    <p  className='text-base font-medium text-richblack-300'>
                    Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.</p>
                    <p className='text-base font-medium text-richblack-300'>
                    As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.</p>
                </div>

                {/* founding story right box */}
                <div className='p-2 border-2 border-blue-200 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
                    <img src= {FoundingStory} alt="" 
                    className='h-full w-full object-cover' />
                </div>
                </div> 
                {/* Vision , mission waala div */}
                <div  className='flex w-full flex-col justify-between gap-10 lg:flex-row lg:gap-0'>
                    {/* left box */}
                    <div className='lg:w-[45%]'>
                        <h1 className='text-4xl font-semibold'>
                <span className='bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent'>
                  Our Vision
                </span>
              </h1>
              <p className='mt-6 text-base font-medium text-richblack-300'>
                With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.
              </p>
                    </div>

                    {/* right box */}
                    <div className='lg:w-[45%]'>
              <h1 className='text-4xl font-semibold'>
                <span className='bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] bg-clip-text text-transparent'>
                  Our Mission
                </span>
              </h1>
              <p className='mt-6 text-base font-medium text-richblack-300'>
                Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
              </p>
            </div>
                </div>
            </div>
        </section>

        {/* section 4 */}
        <section>
            <StatsComponent/>
        </section>

        {/* SECTION 5 */}
        <section className='mx-auto flex flex-col items-center justify-between gap-3'>
            <LearningGrid/>
            <ContactFormSection/>
        </section>

        <div className='relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
        <h1 className='text-center text-4xl font-semibold mt-8'>
          Reviews From Other Learners
        </h1>

        <div className='w-11/12 mx-auto'>
          <ReviewSlider/>
        </div>
        </div>

        <Footer/>
        



    </div>
  )
}

export default About