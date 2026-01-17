import React ,{useEffect, useState} from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import Course_Card from '../components/core/Catalog/Course_Card';
import { apiConnector } from '../services/apiConnector';

function Catalog() {
    //catalog name
    const {catalogName} = useParams();
    const[catalogPageData, setCatalogPageData] = useState(null);
    const[categoryId, setCategoryId] = useState("");
    const [activeOption, setActiveOption] = useState(1);
    //fecth all category 
    //jis mai click kroge --> every time new url --> catalog name change hoga 
    useEffect(() => {
        const getCategories = async() => {
           try{
             const res = await apiConnector("GET",categories.CATEGORIES_API);
            console.log("res",res);
            const category_id = res?.data?.allCategory?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]?._id; //jis id mai // id of currently selected category 
            console.log("categoryid",category_id);
            //pytho click kiya tho pytho ki category id aa gyi  
            setCategoryId(category_id);
           }

           catch(error){
            console.log("Could not fetch categories", error);
           }
        }
        getCategories();
    },[catalogName]);


    useEffect(()=>{
        const getCategoryDetails = async() => {
            try{
                 if (!categoryId) return;
                const res = await getCatalogPageData(categoryId);
                console.log("Printing res",res)
                setCatalogPageData(res);
                console.log("catalogpagedt",catalogPageData);
                console.log("catalogpagedt",catalogPageData?.data?.selectedCategory);

            }
            catch(error){
                console.log(error)
            }
        }
       if(categoryId){
        getCategoryDetails();
       }
    },[categoryId]);
    useEffect(() => {
        console.log(catalogPageData)
    },[catalogPageData])
  return (
    <div >
        <div className=' box-content bg-richblack-800 px-4'>
            <div className='mx-auto flex min-h-[260px]  flex-col justify-center gap-4 '>
            <p className='text-sm text-richblack-300'>{`Home / Catalog/`}
            <span  className='text-yellow-25'>
            {catalogPageData?.selectedCategory?.name}</span></p>
            <p  className='text-3xl text-richblack-5'>{catalogPageData?.selectedCategory?.name}</p>
            <p className='max-w-[870px] text-richblack-200'>{catalogPageData?.selectedCategory?.description}</p>
        </div>
        </div>
        <div >
            {/* section 1 */}
            <div className=' mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
                <h2 className='text-richblack-5'>
                Courses to get you started
                </h2>
                <div className='my-4 flex border-b border-b-richblack-600 text-sm'>
                <button onClick={()=>{setActiveOption(1)}}  className={activeOption===1? `px-4 py-2 border-b border-b-yellow-25 text-yellow-25 cursor-pointer`:`px-4 py-2 text-richblack-50 cursor-pointer` }>Most Populer</button>
                <button onClick={()=>{setActiveOption(2)}} className={activeOption===1?'px-4 py-2 text-richblack-50 cursor-pointer':'px-4 py-2 border-b border-b-yellow-25 text-yellow-25 cursor-pointer'}>New</button>
                </div>
                <div>
                    <CourseSlider courses = {catalogPageData?.selectedCategory?.courses}/>
                </div>
            </div>

            {/* section 2 */}
            <div className=' mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
                <p className='section_heading mb-6 md:text-3xl text-xl'>Top Courses in {catalogPageData?.selectedCategory?.name} </p>
                <div>
                    <CourseSlider courses = {catalogPageData?.differentCategories[0]?.courses} />
                </div>
            </div>

            {/* //section 3 */}
            <div className=' mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
                <h2 className='section_heading mb-6 md:text-3xl text-xl'>
                    Frequently BoughtTogether
                </h2>
                <div className='py-8'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-6 lg:grid-cols-2 pr-4'>
                        {
                            catalogPageData?.mostSellingCourses?.slice(0,4)
                            .map((course,index) => (
                                <Course_Card course = {course} key = {index} Height={"h-[100px] lg:h-[400px]"}/>
                                
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Catalog