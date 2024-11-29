import Types from './Types';
import { basicTypeTemplate, objectTemplate, typeWithTemplateInput } from '../constants/templates';
import { CustomSelectField, CustomTextInput } from '../../../common/fields';
import { selectionTypes } from '../constants/templates';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
function TypeDetails({ typeData, onUpdate, index, onResolve, moduleId, isUnresolved }) {
  const [openResolve, setOpenResolve] = useState(false);
  const [resolvedName, setResolvedName] = useState('');
  const [schemaChoice, setSchemaChoice] = useState('new');
  const { type, $ref } = typeData;

  const selectedType = selectionTypes[type];
  const schemaList = useSelector((state) => state.schemas.schemaList[moduleId]);

  const transformedSchemaList = schemaList
    ? Object.keys(schemaList).map((key) => ({
        value: key,
        label: schemaList[key].name,
      }))
    : [];
  const combinedOptions = [...basicTypeTemplate, ...transformedSchemaList];
  const changeType = (val) => {
    if (val.templates) {
      const updatedType = typeWithTemplateInput;
      updatedType.templateInputs = [];
      for (let i = 0; i < val.templates.length; i++) {
        updatedType.templateInputs.push({
          selection: 'anyOf',
          types: [{ type: 'any' }],
        });
      }
      updatedType['type'] = val.value;
      onUpdate(updatedType);
      return;
    } else if (val.value === 'object') {
      const updatedType = { ...objectTemplate };
      onUpdate(updatedType);
      return;
    } else {
      const updatedType = { type: val.value };
      onUpdate(updatedType);
    }
  };

  const updateTemplateInput = (val, i) => {
    const updatedType = { ...typeData };
    updatedType.templateInputs = updatedType.templateInputs.map((input, index) => (index === i ? val : input));
    onUpdate(updatedType);
  };

  const handleResolve = async () => {
    if (schemaChoice === 'new') {
      const payload = {
        newName: resolvedName,
        schemaDetails: typeData,
        propertyDetails: { index: index },
      };
      onResolve(payload);
    } else {
      const payload = {
        propertyDetails: { index },
        existingSchemaId: resolvedName,
      };
      onResolve(payload);
    }
    setOpenResolve(false);
  };

  return (
    <>
      <div className="row br-background-secondary">
        <div className="col-12 mb-2">
          {!isUnresolved && (
            <CustomSelectField
              name="moduleSelect"
              value={type ? type : $ref}
              onChange={(val) => changeType(val)}
              options={combinedOptions}
              className="form-select br-form-select form-select-sm"
              sendSelectedOption={true}
            />
          )}
          {type === 'object' && !openResolve && (
            <>
              <i
                className="badge breeze-badge mt-1 bi bi-exclamation-circle br-text-primary"
                style={{ cursor: 'pointer', border: '1px solid #ffcc00' }}
                title="resolve-object-type"
                onClick={() => setOpenResolve(true)}
              >
                <span className="mx-1">Resolve</span>
              </i>

              <div className="overlay my-2" style={{ border: '1px dashed gray' }}>
                <div className="m-2 br-text-primary" style={{ maxHeight: '100px', overflow: 'auto' }}>
                  <pre>
                    <code>{JSON.stringify(typeData, null, 2)}</code>
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>
        {openResolve && (
          <div className="row">
            <div className="col-12">
              <div className="overlay" style={{ border: '1px dashed gray' }}>
                <div className="m-2 br-text-primary" style={{ maxHeight: '100px', overflow: 'auto' }}>
                  <pre>
                    <code>{JSON.stringify(typeData, null, 2)}</code>
                  </pre>
                </div>
              </div>
              <div className="my-2 btn-group">
                <button
                  type="button"
                  className={`btn  btn-sm ${schemaChoice === 'new' ? 'btn-secondary' : 'btn-outline-secondary'} br-text-primary`}
                  onClick={() => setSchemaChoice('new')}
                >
                  Create a new schema
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${schemaChoice === 'existing' ? 'btn-secondary' : 'btn-outline-secondary'} br-text-primary`}
                  onClick={() => setSchemaChoice('existing')}
                >
                  Select from existing
                </button>
              </div>
            </div>
            <div className="col-11">
              {schemaChoice === 'new' ? (
                <CustomTextInput
                  name="propertyName"
                  value={resolvedName}
                  className={'form-control br-form-control form-control-sm my-1'}
                  onChange={(val) => setResolvedName(val)}
                  placeholder="Enter schema name"
                />
              ) : (
                <CustomSelectField
                  name="existingSchemas"
                  value={resolvedName}
                  onChange={(val) => setResolvedName(val)}
                  options={transformedSchemaList}
                  className="form-select br-form-select form-select-sm"
                />
              )}
            </div>
            <div className="col-1 my-1">
              <i
                className="badge breeze-badge-active br-text-primary"
                style={{ cursor: 'pointer' }}
                title="add-other-type"
                onClick={handleResolve}
              >
                <span>Resolve</span>
              </i>
            </div>
          </div>
        )}
        <div className="col-12 ms-3 my-1" style={{ borderLeft: '1px solid rgba(128, 128, 128, 0.5)' }}>
          {selectedType?.templates &&
            selectedType.templates.map((val, i) => {
              return (
                <div key={val['name']}>
                  <span className="br-text-primary my-1">{val['name']}</span>
                  <Types
                    propertyData={typeData.templateInputs[i]}
                    onUpdate={(value) => updateTemplateInput(value, i)}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
TypeDetails.propTypes = {
  typeData: PropTypes.shape({
    type: PropTypes.string,
    $ref: PropTypes.string,
    templateInputs: PropTypes.array,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  onResolve: PropTypes.func.isRequired,
  moduleId: PropTypes.string.isRequired,
};

export default TypeDetails;
