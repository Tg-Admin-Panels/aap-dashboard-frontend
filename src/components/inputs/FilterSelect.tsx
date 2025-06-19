// src/components/common/FilterSelect.tsx
import React from "react";

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <select
      className="text-sm px-1 py-1 outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" className="dark:bg-gray-900 text-black dark:text-white ">
        {label}
      </option>
      {options.map((option) => (
        <option
          key={option}
          value={option}
          className="dark:bg-gray-900 text-black dark:text-white"
        >
          {option}
        </option>
      ))}
    </select>
  );
};

export default FilterSelect;
