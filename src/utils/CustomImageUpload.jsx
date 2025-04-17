import React, { useState } from 'react';
import { IoCloudUpload } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";

const CustomImageUpload = ({ value, setValue, isMany }) => {
    const [previews, setPreviews] = useState([]);

    const handleImageChangeMany = (event) => {
        const files = Array.from(event.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setValue((prevImages) => [...prevImages, ...files]);
        setPreviews((prevImages) => [...prevImages, ...imageUrls]);
    };

    const handleImageChangeSingle = (event) => {
        const file = event.target.files[0];
        if (file) {
            // setImage(file);
            // setPreview(URL.createObjectURL(file));
            setValue(file);
        }
    };

    const handleIconClick = () => {
        document.getElementById('upload').click();
    };

    const handleRemoveImage = (imageToRemove) => {
        isMany ? setValue((prevImages) => prevImages.filter(image => image !== imageToRemove)) : setValue('')
    };

    return (
        <div className='w-full'>
            <div className="flex items-center text-black">
                <button
                    onClick={handleIconClick}
                    className="p-3 bg-gray-100 rounded-md cursor-pointer w-full flex flex-col justify-center items-center gap-5"
                    style={{ cursor: 'pointer' }}
                >
                    <IoCloudUpload size={70} color='var(--maincolor)' />
                    <h2 className='text-lg font-medium'>Зураг оруулах</h2>
                </button>
            </div>

            <input
                type="file"
                accept="image/*"
                onChange={isMany ? handleImageChangeMany : handleImageChangeSingle}
                multiple
                id="upload"
                className="hidden"
            />

            <div>
                {value && <h3 className='text-black mt-5'>Таны оруулсан зураг:</h3>}
                <div className="grid grid-cols-3 gap-x-3 gap-y-4">
                    {isMany ? previews.map((image, index) => (
                        <div key={index} className="relative">
                            <img
                                src={image}
                                alt={`Preview ${index}`}
                                style={{
                                    maxWidth: '200px',
                                    maxHeight: '200px',
                                    margin: '5px',
                                }}
                            />
                            <button
                                onClick={() => handleRemoveImage(image)}
                                className="absolute top-0 right-0 text-white bg-red-600 bg-opacity-65 
                                hover:bg-opacity-100 rounded-full p-1 ease-in-out duration-300"
                                style={{ fontSize: '16px' }}
                            >
                                <IoIosCloseCircleOutline size={30} color='white' />
                            </button>
                        </div>
                    )) :
                        value && <div className="relative">
                            <img
                                src={URL.createObjectURL(value)}
                                alt={`Preview `}
                                style={{
                                    maxWidth: '200px',
                                    maxHeight: '200px',
                                    margin: '5px',
                                }}
                            />
                            <button
                                onClick={() => handleRemoveImage(value)}
                                className="absolute top-0 right-0 text-white bg-red-600 bg-opacity-65 
                                hover:bg-opacity-100 rounded-full p-1 ease-in-out duration-300"
                                style={{ fontSize: '16px' }}
                            >
                                <IoIosCloseCircleOutline size={30} color='white' />
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default CustomImageUpload;
