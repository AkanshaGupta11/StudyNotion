instructor acc se login kiya --> can create course 

step 1
course information 

view courseslice.jsx 
course api 


steps:
step le kr aau --> state.course

const steps = [
    {id:
    title:
    }
]

return 
(
    {
        steps.map((item) => {
            <div className = `${step == item.id: "" ?""}`>
            
        })
    }
)


error --> cannot destructure steps 
reducer mai add nhi kiya 

category mai click kro ---> tho drop down aata hain --> info set krne k liye --> courseCategory , setCourseCateory 

useEffect k use kr ke saari category ko le aau , vho course ki 

useEffect(() => {
    //loading true 
    const categories = await fetchCourseCategory();

    if(categories.length > 0){
        //valid 
        setCourseCategory(categpries);
    }
     loading false;
})

if(editCpurse){
    sarii value ko set kr do 
    course naam , desc , price, tags  , benefits 
}



required field mai error 
ek add hogya , baaki add nhi ho rhe 

authorisation mai true 

failed to load resources
