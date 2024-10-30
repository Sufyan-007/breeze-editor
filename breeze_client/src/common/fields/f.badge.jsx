import PropTypes from 'prop-types';
import { useState } from 'react';

function CustomBadge({
  label,
  options,
  selectedValue,
  onBadgeSelect,
  isRequired,
  isSubmitted = false,
  errorMessage,
  config,
}) {
  const [isTouched, setIsTouched] = useState(false);
  const showError = isRequired && (isTouched || isSubmitted) && selectedValue.length === 0;
  const displayErrorMessage = errorMessage || (showError ? `${label} is required!` : '');

  return (
    <div className={config.groupClass || 'mb-3 home-form-box'}>
      <label className={config.labelClass || 'med-font color-text mb-1 fw-semibold'}>
        {label} {isRequired && <span className="text-danger">*</span>}
      </label>
      <div className={config.badgeWrapperClass || 'home-badges-wrapper'}>
        {options.map((option) => (
          <span
            className={`home-badge home-theme-badge ${selectedValue.includes(option.label) ? 'breeze-badge-active' : ''}`}
            key={option.label}
            onClick={() => {
              onBadgeSelect(option.label);
              setIsTouched(true);
            }}
          >
            <img src={option.logo} alt={`${option.label} logo`} />
            <span className="med-font ms-1">{option.label}</span>
          </span>
        ))}
      </div>
      {showError && <p className="small-font text-danger mb-0">{displayErrorMessage}</p>}
    </div>
  );
}

CustomBadge.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]).isRequired,
  onBadgeSelect: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  errorMessage: PropTypes.string,
  config: PropTypes.shape({
    groupClass: PropTypes.string,
    labelClass: PropTypes.string,
    badgeWrapperClass: PropTypes.string,
  }),
};

export default CustomBadge;
