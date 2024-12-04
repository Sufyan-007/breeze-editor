import PropTypes from 'prop-types';

function ServiceCall({ onSubmit, onCancel, editMode }) {
  return <div>ServiceCall</div>;
}

ServiceCall.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  editMode: PropTypes.bool,
};
export default ServiceCall;

// import PropTypes from 'prop-types';
// import { useEffect, useState } from 'react';
// import { availableServices } from '../../constants/FormConstants';
// import '../../styles/servicesSelect.css';
// import { CustomButtonField, CustomCheckBoxField, CustomTextInput } from '../../../../common/fields';
// import { funcConfigTemplates } from '../../constants/functionConfigTemplates';

// function ServiceCall({ onSubmit, onCancel, editMode }) {
//   const initialServiceCallConfig = JSON.parse(JSON.stringify(funcConfigTemplates['serviceCall']));
//   const [formData, setFormData] = useState({ ...initialServiceCallConfig });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [debouncedQuery, setDebouncedQuery] = useState('');
//   const [filteredOptions, setFilteredOptions] = useState(availableServices);
//   const [selectedService, setSelectedService] = useState(null);
//   const [checkedItems, setCheckedItems] = useState({
//     thenCatch: false,
//     declarationCall: false,
//     awaitCall: false,
//   });

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedQuery(searchQuery);
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   useEffect(() => {
//     const filterData = availableServices.filter((item) =>
//       item.serviceName.toLowerCase().includes(debouncedQuery.toLowerCase())
//     );
//     setFilteredOptions(filterData);
//   }, [debouncedQuery]);

//   const handleSelect = (service) => {
//     setSelectedService(service);
//     setSearchQuery('');
//     setFilteredOptions([]);
//     console.log('Selected Service:', service);
//   };

//   const handleCheckboxChange = (field, value) => {
//     setCheckedItems((prevState) => {
//       const updatedItems = { ...prevState, [field]: value };

//       if (field === 'thenCatch' && value) {
//         updatedItems.awaitCall = false;
//       } else if (field === 'awaitCall' && value) {
//         updatedItems.thenCatch = false;
//       }

//       return updatedItems;
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit({});
//   };

//   const handleCancel = (e) => {
//     e.preventDefault();
//     onCancel();
//   };

//   return (
//     <div className="service-call-config-form h-100">
//       <div className="d-flex flex-column justify-content-between h-100">
//         <div>
//           <div className="services-select">
//             <CustomTextInput
//               name="query"
//               value={searchQuery}
//               onChange={(value) => setSearchQuery(value)}
//               config={{
//                 label: 'Select Service',
//                 groupClass: 'form-group mb-2',
//               }}
//               placeholder="Search.."
//             />
//             <ul
//               className="service-dropdown-menu"
//               style={{ display: searchQuery ? 'block' : 'none', maxHeight: '200px', overflowY: 'auto' }}
//             >
//               {filteredOptions.map((item) => (
//                 <li
//                   key={item.id}
//                   className="service-dropdown-item br-text-primary d-flex justify-content-between med-font"
//                   onClick={() => handleSelect(item)}
//                 >
//                   <div>
//                     <strong>{item.serviceName} </strong>- {item.fileName}
//                   </div>
//                   <div>({item.moduleName})</div>
//                 </li>
//               ))}
//               {filteredOptions.length === 0 && (
//                 <li key={0} className="service-dropdown-item br-text-primary">
//                   No service found
//                 </li>
//               )}
//             </ul>
//           </div>

//           <div className="br-text-primary large-font mb-2">
//             <strong>Selected Service : {selectedService?.serviceName}</strong>
//           </div>

//           <div className="br-text-primary large-font mb-2">Configure your service call</div>
//           <div className="d-flex">
//             <CustomCheckBoxField
//               name="thenCatch"
//               value={checkedItems.thenCatch || false}
//               onChange={(value) => handleCheckboxChange('thenCatch', value)}
//               config={{ label: 'Then catch', groupClass: 'form-check me-2' }}
//             />
//             <CustomCheckBoxField
//               name="declarationCall"
//               value={checkedItems.declarationCall || false}
//               onChange={(value) => handleCheckboxChange('declarationCall', value)}
//               config={{ label: 'Declaration', groupClass: 'form-check me-2' }}
//             />
//             <CustomCheckBoxField
//               name="awaitCall"
//               value={checkedItems.awaitCall || false}
//               onChange={(value) => handleCheckboxChange('awaitCall', value)}
//               config={{ label: 'Await', groupClass: 'form-check me-2' }}
//             />
//           </div>
//           <div className="br-text-primary large-font mb-2">Param Mapping</div>
//         </div>
//         <div className="d-flex justify-content-end">
//           <CustomButtonField
//             type="button"
//             label={'Cancel'}
//             className="btn br-secondary-button med-font mx-2"
//             onClick={handleCancel}
//           />
//           <CustomButtonField
//             type="button"
//             label={editMode ? 'Update' : 'Submit'}
//             className="btn btn-filled med-font"
//             onClick={handleSubmit}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// ServiceCall.propTypes = {
//   onSubmit: PropTypes.func,
//   onCancel: PropTypes.func,
//   editMode: PropTypes.bool,
// };
// export default ServiceCall;
