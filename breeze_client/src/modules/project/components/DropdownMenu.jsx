import PropTypes from 'prop-types';

const DropdownMenu = ({ dropdownVisible, options, onOptionClick }) => {
  const handleOptionClick = (option) => {
    onOptionClick(option);
  };

  return (
    <div className="dropdown">
      <ul className={`dropdown-menu br-background-primary ${dropdownVisible ? 'show' : ''}`}>
        {options.map(({ label, icon }, index) => (
          <li key={index}>
            <button
              className="dropdown-item br-text-primary d-flex justify-content-between"
              type="button"
              onClick={() => handleOptionClick(label)}
            >
              <div>{icon}</div>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

DropdownMenu.propTypes = {
  dropdownVisible: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
  onOptionClick: PropTypes.func.isRequired,
};

export default DropdownMenu;
