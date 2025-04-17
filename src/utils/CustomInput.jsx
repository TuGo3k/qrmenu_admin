import React from "react";

const CustomInput = ({
  onChange,
  value,
  placeHolder,
  icon,
  isPassword,
  expandDown,
  className,
}) => {
  return (
    <div className="relative">
      <input
        value={value}
        type={isPassword ? "password" : "text"}
        onChange={(e) => (onChange ? onChange(e.target.value) : null)}
        placeholder={placeHolder}
        className={`focus:outline-none px-4 h-full border-b-[1px] border-[#d3d3d3]  bg-none text-md font-thin text-[#333] ${className}`}
      />
      {icon && (
        <span src="/search.svg" className="absolute right-1">
          <img src="/search.svg" />
        </span>
      )}

      {expandDown && (
        <span src="/expand_down.svg" className="absolute right-1">
          <img src="/expand_down.svg" />
        </span>
      )}
    </div>
  );
};

export default CustomInput;
