import React from 'react'

function IconBtn({
    text,
    onClick,
    children,
    disabled,
    outline = false,
    customClasses,
    type,
})

{
    console.log("ji");
  return (
    
        <button 
        
        disabled = {disabled}
        onClick={onClick}
        type ={type}
        className= {customClasses}>
            {
                children ? (
                    <>
                    <span>
                        {text}
                    </span>
                    {children}
                    </>
                ) :(text)
            }
        </button>
    
  )
}

export default IconBtn