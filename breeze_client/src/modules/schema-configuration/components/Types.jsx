import TypeDetails from './TypeDetails';

function Types({ propertyData, onUpdate }) {
  const handleChange = (val, index) => {
    const updateProperty = { ...propertyData };
    updateProperty['types'] = updateProperty['types'].map((type, i) => (i === index ? val : type));
    // console.log(updateProperty, 'jfdsklf');
    onUpdate(updateProperty);
  };

  const addType = () => {
    const newType = { type: 'string' };
    const updateProperty = { ...propertyData };
    updateProperty['types'] = [...updateProperty['types']];
    updateProperty['types'].push(newType);
    // console.log(updateProperty);
    onUpdate(updateProperty);
  };

  return (
    <>
      <div className="row">
        <div className="col-11">
          {propertyData.types.map((prop, index) => (
            <TypeDetails key={index} typeData={prop} onUpdate={(val) => handleChange(val, index)} index={index} />
          ))}
        </div>
        <div className="col-1">
          <i
            className=" badge breeze-badge-active bi bi-plus-circle br-text-primary"
            style={{ cursor: 'pointer' }}
            title="add-other-type"
            onClick={addType}
          >
            <span className="mx-1">Add</span>
          </i>
        </div>
      </div>
    </>
  );
}

export default Types;
