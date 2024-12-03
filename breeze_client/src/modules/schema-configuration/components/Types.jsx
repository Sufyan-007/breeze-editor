import PropTypes from 'prop-types';
import TypeDetails from './TypeDetails';

function Types({ propertyData, onUpdate, moduleId, selectedSchema, propertyName, onResolve, isUnresolved }) {
  const handleChange = (val, index) => {
    const updateProperty = { ...propertyData };
    updateProperty['types'] = updateProperty['types'].map((type, i) => (i === index ? val : type));
    onUpdate(updateProperty);
  };

  const addType = () => {
    const newType = { type: 'string' };
    const updateProperty = { ...propertyData };
    updateProperty['types'] = [...updateProperty['types']];
    updateProperty['types'].push(newType);
    onUpdate(updateProperty);
  };
  const handleResolve = (payload) => {
    onResolve(payload);
  };
  return (
    <>
      <div className="row">
        <div className="col-11">
          {propertyData.types.map((prop, index) => (
            <TypeDetails
              key={index}
              typeData={prop}
              onUpdate={(val) => handleChange(val, index)}
              index={index}
              moduleId={moduleId}
              selectedSchema={selectedSchema}
              propertyName={propertyName}
              onResolve={handleResolve}
              isUnresolved={isUnresolved}
            />
          ))}
        </div>
        {/* <div className="col-1">
          <i
            className=" badge breeze-badge-active bi bi-plus-circle br-text-primary"
            style={{ cursor: 'pointer' }}
            title="add-other-type"
            onClick={addType}
          >
            <span className="mx-1">Add</span>
          </i>
        </div> */}
      </div>
    </>
  );
}

Types.propTypes = {
  propertyData: PropTypes.shape({
    types: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  moduleId: PropTypes.string.isRequired,
  selectedSchema: PropTypes.object.isRequired,
  propertyName: PropTypes.string.isRequired,
  onResolve: PropTypes.func.isRequired,
};
export default Types;
