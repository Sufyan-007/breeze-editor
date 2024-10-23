import { typeTemplate } from '../constants/templates';
import PropertyDetailsCard from './PropertyDetailsCard';

function ObjectDetails({ objectData, onUpdate, moduleId }) {
  const { properties } = objectData;

  const handleChange = (prop, value) => {
    // console.log(prop, value, 'in obj details');

    const updatedSchema = { ...objectData };
    if (value) {
      updatedSchema.properties = { ...updatedSchema.properties, [prop]: value };
    } else {
      updatedSchema.properties = { ...updatedSchema.properties };
      delete updatedSchema.properties[prop];
    }
    // console.log(updatedSchema, 'udpated schema');

    onUpdate(updatedSchema, moduleId);
  };

  const addProperty = () => {
    const newPropertyKey = `property${Object.keys(properties).length + 1}`;
    const newProperty = { ...typeTemplate };
    const updatedSchema = { ...objectData };
    updatedSchema.properties = { ...updatedSchema.properties, [newPropertyKey]: newProperty };
    console.log(updatedSchema);
    onUpdate(updatedSchema, moduleId);
  };
  const changePropertyName = (oldkey, newkey, data) => {
    const updatedSchema = { ...objectData };
    updatedSchema.properties = { ...updatedSchema.properties, [newkey]: data };
    delete updatedSchema.properties[oldkey];
    onUpdate(updatedSchema, moduleId);
  };

  return (
    <>
      <div className="ml-3 mt-1 my-1">
        <div className="mt-2">
          <span className="br-text-primary fw-semibold">Properties:</span>
          <i
            className="bi bi-plus-circle mx-2 br-text-primary"
            style={{ cursor: 'pointer' }}
            title="add-property"
            onClick={addProperty}
          ></i>
        </div>

        {Object.entries(properties).map(([propKey, property]) => (
          <div className="card my-1 br-background-secondary ms-2" key={propKey}>
            <PropertyDetailsCard
              propKey={propKey}
              property={property}
              handleChange={handleChange}
              changePropertyName={changePropertyName}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default ObjectDetails;
