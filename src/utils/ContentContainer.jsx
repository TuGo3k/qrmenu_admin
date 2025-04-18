import React from 'react'

const ContentContainer = ({ children, className }) => {
  return (
    <div className='w-full h-screen flex flex-col bg-[var(--hover)] p-6' >
             {children}
    </div>
  )
}

export default ContentContainer