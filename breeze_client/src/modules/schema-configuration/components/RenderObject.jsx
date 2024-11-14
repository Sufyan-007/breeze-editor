import { useState } from 'react';
import PropTypes from 'prop-types';
function RenderObject({ propertyName, value, updateParent, depth = 0, schemaList }) {
  const [val, setVal] = useState(value);
  const [name, setName] = useState(propertyName);
  const marginLeft = `${depth * 20}px`;
  const cardStyles = [
    { backgroundColor: '#343a40', borderColor: 'rgba(128, 128, 128, 0.5)' }, // Depth 0
    { backgroundColor: '#495057', borderColor: 'rgba(128, 128, 128, 0.5)' }, // Depth 1
    { backgroundColor: '#6c757d', borderColor: 'rgba(128, 128, 128, 0.5)' }, // Depth 2
  ];
  const handleChanges = (prop, value) => {
    console.log(prop, value);
    if (prop === 'name') {
      setName(() => {
        updateParent(val, value);
        return value;
      });
    } else {
      setVal((val) => {
        val[prop] = value;
        updateParent(val);
        return { ...val };
      });
    }
  };

  const addProperty = () => {
    const properties = val.properties || {};
    const newPropertyKey = `property${Object.keys(properties).length + 1}`;
    console.log('ADded property');
    const newProperty = {
      type: '',
      required: false,
      example: '',
      objectType: '',
    };
    setVal((prevState) => {
      properties[newPropertyKey] = newProperty;
      const updatedVal = {
        ...prevState,
        properties: properties,
      };
      updateParent(updatedVal);
      return updatedVal;
    });
  };

  const editChild = (key, value, newKey = null) => {
    if (value) {
      if (newKey) {
        setVal((val) => {
          delete val.properties[key];
          val.properties[newKey] = value;
          updateParent(val);
          return { ...val };
        });
      } else {
        setVal((val) => {
          val.properties[key] = value;
          updateParent(val);
          return { ...val };
        });
      }
    } else {
      setVal((val) => {
        delete val.properties[key];
        updateParent(val);
        return { ...val };
      });
    }
  };

  const deleteProperty = () => {
    updateParent(null, null);
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const cardStyle = {
    backgroundColor: cardStyles[depth % cardStyles.length].backgroundColor,
    border: `1px solid ${cardStyles[depth % cardStyles.length].borderColor}`,
    marginLeft: marginLeft,
  };
  return (
    <>
      <div className="card rounded-0 mt-1" style={cardStyle}>
        <div className="card-body d-flex justify-content-between text-white">
          {isExpanded ? (
            <>
              <div style={{ width: '30%' }}>
                <input
                  className="form-control form-control-sm text-white"
                  size="sm"
                  type="text"
                  placeholder="Name"
                  defaultValue={name}
                  onBlur={(e) => handleChanges('name', e.target.value)}
                  style={{
                    backgroundColor: '#212529',
                    border: '1px solid rgba(128, 128, 128, 0.5)',
                  }}
                />
              </div>
              <div style={{ width: '30%' }}>
                <select
                  className="form-select form-select-sm text-white"
                  size="sm"
                  style={{
                    backgroundColor: '#212529',
                    border: '1px solid rgba(128, 128, 128, 0.5)',
                  }}
                  value={val.type}
                  onChange={(e) => handleChanges('type', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="string">String</option>
                  <option value="integer">Integer</option>
                  <option value="array">Array</option>
                  <option value="any">Any</option>
                  {schemaList &&
                    schemaList.map((name, index) => (
                      <option key={index} value={name.name}>
                        {name.name}
                      </option>
                    ))}
                </select>
              </div>
              {val.type === 'string' || val.type === 'integer' ? (
                <div style={{ width: '30%' }}>
                  <input
                    className="form-control form-control-sm text-white"
                    size="sm"
                    type="text"
                    placeholder="Value"
                    value={val.example}
                    onChange={(e) => handleChanges('example', e.target.value)}
                    style={{
                      backgroundColor: '#212529',
                      border: '1px solid rgba(128, 128, 128, 0.5)',
                    }}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <span>{name}</span>
          )}

          <div>
            <i className="bi bi-pencil-square" onClick={() => setIsExpanded((state) => !state)}></i>
            <i className="bi bi-trash3" alt="delete" onClick={() => deleteProperty()}></i>
          </div>
        </div>

        {isExpanded && (
          <div className="text-white p-1 my-1">
            {val.type === 'object' && val.objectType === 'custom' && (
              <div className="d-flex">
                <span className="text-white mx-3">Sub Properties</span>
                <i className="bi bi-plus-circle" width="25" height="25" onClick={addProperty}></i>
              </div>
            )}
            {val.types &&
              val.types.map((type) => {
                {
                  {
                    console.log(type, 'inside');
                  }
                  type.properties &&
                    Object.entries(type.properties).map(([k, prop]) => {
                      <RenderObject
                        key={k}
                        propertyName={k}
                        value={prop.types[0]}
                        updateParent={(value, newKey = null) => editChild(type, value, newKey)}
                        depth={depth + 1}
                        schemaList={schemaList}
                      />;
                    });
                }
              })}
          </div>
        )}
      </div>
    </>
  );
}
RenderObject.propTypes = {
  propertyName: PropTypes.string.isRequired,
  value: PropTypes.shape({
    type: PropTypes.string,
    required: PropTypes.bool,
    example: PropTypes.string,
    objectType: PropTypes.string,
    properties: PropTypes.objectOf(
      PropTypes.shape({
        type: PropTypes.string,
        required: PropTypes.bool,
        example: PropTypes.string,
        objectType: PropTypes.string,
      })
    ),
  }).isRequired,
  updateParent: PropTypes.func.isRequired,
  depth: PropTypes.number,
  schemaList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RenderObject;
