import PropTypes from 'prop-types';
import { typeTemplate } from '../constants/templates';
import PropertyDetailsCard from './PropertyDetailsCard';
import TypeDetails from './TypeDetails';

function ObjectDetails({ objectData, onUpdate, moduleId, selectedSchema, onResolve }) {
  const { properties, types } = objectData;

  const handleChange = (prop, value) => {
    const updatedSchema = { ...objectData };
    if (value) {
      updatedSchema.properties = { ...updatedSchema.properties, [prop]: value };
    } else {
      updatedSchema.properties = { ...updatedSchema.properties };
      delete updatedSchema.properties[prop];
    }
    onUpdate(updatedSchema, moduleId);
  };

  const addProperty = () => {
    const newPropertyKey = `property${Object.keys(properties).length + 1}`;
    const newProperty = { ...typeTemplate };
    const updatedSchema = { ...objectData };
    updatedSchema.properties = { ...updatedSchema.properties, [newPropertyKey]: newProperty };
    onUpdate(updatedSchema, moduleId);
  };
  const changePropertyName = (oldkey, newkey, data) => {
    if (oldkey !== newkey) {
      const updatedSchema = { ...objectData };
      updatedSchema.properties = { ...updatedSchema.properties, [newkey]: data };
      delete updatedSchema.properties[oldkey];
      onUpdate(updatedSchema, moduleId);
    }
  };

  const handleResolve = (payload) => {
    const updatedPayload = { ...payload };
    updatedPayload['moduleId'] = moduleId;
    onResolve(updatedPayload);
  };

  return (
    <>
      <div className="ml-3 mt-1 my-1">
        {properties && (
          <div className="mt-2">
            <span className="br-text-primary fw-semibold">Properties:</span>
            <i
              className="bi bi-plus-circle mx-2 br-text-primary"
              style={{ cursor: 'pointer' }}
              title="add-property"
              onClick={addProperty}
            ></i>
          </div>
        )}

        {properties ? (
          Object.entries(properties).map(([propKey, property]) => (
            <div className="card my-1 br-background-secondary ms-2" key={propKey}>
              <PropertyDetailsCard
                propKey={propKey}
                property={property}
                handleChange={handleChange}
                changePropertyName={changePropertyName}
                moduleId={moduleId}
                selectedSchema={selectedSchema}
                onResolve={handleResolve}
                isUnresolved={property.isUnresolved}
              />
            </div>
          ))
        ) : (
          <div className="row">
            {/* <div className="col-1"></div> */}
            <div className="col-11">
              {types.map((prop, index) => (
                <TypeDetails
                  key={index}
                  typeData={prop}
                  onUpdate={(val) => handleChange(val, index)}
                  index={index}
                  moduleId={moduleId}
                  selectedSchema={selectedSchema}
                  propertyName={''}
                  onResolve={handleResolve}
                  isUnresolved={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
ObjectDetails.propTypes = {
  objectData: PropTypes.shape({
    properties: PropTypes.object.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  moduleId: PropTypes.string.isRequired,
  selectedSchema: PropTypes.object.isRequired,
  onResolve: PropTypes.func.isRequired,
};
export default ObjectDetails;
