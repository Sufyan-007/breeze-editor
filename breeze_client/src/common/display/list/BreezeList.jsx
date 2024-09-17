import { useState, useEffect } from 'react';
import './BreezeList.css';
import PropTypes from 'prop-types';

const CustomMenu = ({ items = [], onItemClick, isSearchable = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(items.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm, items]);

  return (
    <div className="custom-menu">
      {isSearchable && (
        <input
          type="text"
          placeholder="Search.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      )}
      <ul className="menu-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <li key={index} className="menu-item" onClick={() => onItemClick(item)}>
              {item}
            </li>
          ))
        ) : (
          <li className="menu-item">No results found</li>
        )}
      </ul>
    </div>
  );
};

CustomMenu.propTypes = {
  items: PropTypes.array,
  onItemClick: PropTypes.func,
  isSearchable: PropTypes.bool,
};

export default CustomMenu;
