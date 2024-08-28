import { useState, useEffect, useRef } from "react";
import { IoCaretDownOutline } from "react-icons/io5";

const CustomDropdown = ({ label, options, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-fit p-2 text-sm font-medium bg-sky-50 rounded-md dark:bg-neutral-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {options[selectedValue]}
          <IoCaretDownOutline
            className={`w-5 h-5 ml-1 text-gray-500 dark:text-white transition-transform duration-500 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-fit origin-top-right bg-white shadow-xl dark:shadow-none border-2 dark:border-neutral-800 rounded-md dark:bg-neutral-950">
          <div className="p-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className="block font-bold w-full py-2 px-2 rounded-md text-left hover:bg-sky-100 dark:hover:bg-slate-900"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
