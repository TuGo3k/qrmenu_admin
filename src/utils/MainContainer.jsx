import React from 'react'

const MainContainer = ({ children, className }) => {
    return (
        <div className={`  pl-[13vw] pr-3 w-[100%] flex flex-col 
        justify-center  text-black ${className} max-md:pl-5 max-md:mt-[10vh]`}>
            {children}
        </div>
    )
}

export default MainContainer
