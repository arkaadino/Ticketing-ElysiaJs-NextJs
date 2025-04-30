// components/form/SearchableSelect.tsx
import React from "react";
import Select from "react-select";

interface Option {
  value: string | number;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string | number) => void;
  defaultValue?: Option | null;
  className?: string;
}

const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    height: '44px',
    backgroundColor: 'transparent',
    borderColor: state.isFocused ? '#93C5FD' : '#D1D5DB', // focus:brand-300, default:gray-300
    borderRadius: '0.5rem',
    paddingLeft: '1rem',
    paddingRight: '2.75rem',
    fontSize: '0.875rem',
    boxShadow: state.isFocused ? '0 0 0 1px rgba(59,130,246,0.2)' : 'none',
    color: '#1F2937', // text-gray-800
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#9CA3AF', // text-gray-400
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#1F2937', // text-gray-800
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#ffffff',
    zIndex: 20,
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '0.25rem',
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused
      ? '#E0F2FE' // hover:light blue
      : 'transparent',
    color: '#111827', // text-gray-900
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  }),
};

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  defaultValue = null,
  className = "",
}) => {
  const handleChange = (selectedOption: Option | null) => {
    if (selectedOption) {
      onChange(selectedOption.value);
    }
  };

  return (
    <div className={className}>
      <Select
        options={options}
        onChange={handleChange}
        placeholder={placeholder}
        styles={customStyles}
        isSearchable
        defaultValue={defaultValue}
        theme={(theme) => ({
          ...theme,
          borderRadius: 8,
          colors: {
            ...theme.colors,
            primary25: '#E0F2FE',
            primary: '#3B82F6', // brand-500
          },
        })}
      />
    </div>
  );
};

export default SearchableSelect;
