import React from 'react'

const CustomLabel = ({ label, children }) => {
    return (
        <label className='flex flex-col justify-center items-start gap-2'>
            <p className='text-md font-thin text-[#5A5A5A]'>{label}:</p>
            {children}
        </label>
    )
}

export default CustomLabel
