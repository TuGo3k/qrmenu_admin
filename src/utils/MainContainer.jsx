import React from 'react'

const MainContainer = ({ children, className }) => {
    return (
        <div className={` p-5 pl-[19vw] pt-1 pr-3 w-[100%] flex flex-col 
        justify-center gap-5 text-black ${className} max-md:pl-5 max-md:mt-[10vh]`}>
            {children}
        </div>
    )
}

export default MainContainer
