import React, { useState } from "react";
import "./Dropdown.css";

function CustomDropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleOptionSelect = (option) => {
    setIsOpen(false);
    onChange(option);
  };

  return (
    <div className="custom-dropdown">
      <div
        className={`dropdown-header ${isOpen ? "open" : ""}`}
        onClick={handleToggle}
      >
        {value || "Select Category"}
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {options.map((option, index) => (
            <div
              key={index}
              className="dropdown-option"
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
