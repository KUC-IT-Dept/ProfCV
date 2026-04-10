import React from 'react';

const SelectField = ({ label, name, options, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[13px] font-medium text-gray-700">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="h-[38px] px-3 border border-[#D1D5DB] rounded-[4px] bg-white text-sm text-gray-700 outline-none focus:border-blue-500 appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.7rem center',
          backgroundSize: '1em'
        }}
      >
        <option value="" disabled>Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;