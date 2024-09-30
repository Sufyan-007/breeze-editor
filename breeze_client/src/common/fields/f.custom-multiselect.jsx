import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import '../styles.css';

function CustomMultiSelectDropdown({ config, name, values, onChange, options, className, ...rest }) {
  const availableOptions = options || config.options;
  const [selectedValues, setSelectedValues] = useState(values || []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Hook to detect clicks outside the dropdown and close it
  const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    }, [ref, handler]);
  };

  // Call the hook with dropdownRef and handler to close the dropdown
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleCheckboxChange = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    setSelectedValues(newValues);
    onChange(newValues);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const renderSelectedOptions = () => {
    if (selectedValues.length === 0) return 'Select options';
    return selectedValues
      .map((selected) => availableOptions.find((option) => option.value === selected)?.label)
      .join(', ');
  };

  return (
    <div className={config.groupClass || 'form-group'}>
      {config.label && (
        <label className={config.labelClass || 'form-label br-text-primary med-font fw-semibold'}>{config.label}</label>
      )}
      <div className="br-custom-multiselect-dropdown" ref={dropdownRef}>
        <button
          type="button"
          className={config.className || className || 'form-select br-form-select form-select-sm'}
          onClick={handleDropdownToggle}
          {...rest}
        >
          {renderSelectedOptions()}
        </button>

        {isDropdownOpen && (
          <div className="br-custom-multiselect-menu">
            {availableOptions.map((option, index) => (
              <div key={index} className="br-custom-multiselect-item">
                <input
                  type="checkbox"
                  id={`${name}_${index}`}
                  value={option.value}
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleCheckboxChange(option.value)}
                  className="me-2"
                />
                <label className="br-text-primary med-font" htmlFor={`${name}_${index}`}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

CustomMultiSelectDropdown.propTypes = {
  config: PropTypes.any,
  name: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomMultiSelectDropdown;
