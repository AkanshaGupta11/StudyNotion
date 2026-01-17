store -> brain holds all applications data 
slice --> department 

The Problem: Prop Drilling
Imagine your app has a component structure like this. Your token data lives in App.js, but the UserProfile component (deep inside) needs it.

<App> (Has the token)
  <HomePage>
    <Navbar>
      <UserProfile> (Needs the token)


Without Redux, you would have to pass the token as a "prop" through every single component in the middle:

Redux solves this by creating a central store that lives outside your components.

and now u can get/send data directly from store


STORE KY HAIN --> brain type --> saari info iske aandr 
SLICE -> store k ek department hain 


store bnaya 
ab slice 
slice mai konsa data rakhna , 

include global components and not local ones --> like modal change ye include ni krna ye ap usestate se handle kro 

jaise login ho he tho token save krna hain tho ye sb --> store krnege 
/jho data pure app ko affect kr rha ho 
--> loading 


