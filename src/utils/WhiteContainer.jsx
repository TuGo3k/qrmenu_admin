import React from 'react'

const WhiteContainer = ({ children, width, className, bg }) => {
    return (
        <div style={{
            width: width ? width : '',
            background: bg ? bg : '#fff'
        }} className={`custom-shadow px-3 rounded-md py-3 ${className}`}>
            {children}
        </div>
    )
}

export default WhiteContainer
