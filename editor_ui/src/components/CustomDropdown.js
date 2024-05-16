import React, {useState} from "react";
import { Dropdown } from "react-bootstrap";

const CustomDropdown = ({options, onSelect} )=> {
      const [selectedOption, setSelectedOption] = useState(null);

      const handleItemClick = (api) => {
        setSelectedOption(api);
        onSelect(api);
      };

    return (
      <Dropdown onSelect={(eventKey) => onSelect(eventKey)} className="mx-5" >
        <Dropdown.Toggle variant="secondary">
          {selectedOption ? selectedOption.operation_id : "Select an option"}
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ textAlign: "center" }}>
          {options.map((api) => (
            <Dropdown.Item
              key={api.id}
              eventKey={api.id}
              className="dropdownitem"
              onClick={() => handleItemClick(api)}
            >
              {api.operation_id}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
//     const[isOpen, setIsOpen] = useState(false);
//     const [selectedItem, setSelectedItem] = useState(null);

//     const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleItemClick = (item) => {
//     setSelectedItem(item);
//     setIsOpen(false);
//     onSelect(item);
//   };

//     return (
//       <div className={`dropdown ${className}`}>
//         <button
//           className="btn btn-secondary dropdown-toggle"
//           type="button"
//           onClick={toggleDropdown}
//         >
//           {selectedItem ? selectedItem.operation_id : "Select an option"}
//         </button>
//         {isOpen && (
//           <div className="dropdown-menu" style={{ textAlign: "center" }}>
//             {options.map((option) => (
//               <button
//                 key={option.id}
//                 className="dropdown-item"
//                 onClick={() => handleItemClick(option)}
//               >
//                 {option.operation_id}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     );


}
export default CustomDropdown;