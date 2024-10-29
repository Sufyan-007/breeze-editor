import Types from './Types';
import { basicTypeTemplate, objectTemplate, typeWithTemplateInput } from '../constants/templates';
import { CustomSelectField, CustomTextInput } from '../../../common/fields';
import { selectionTypes } from '../constants/templates';
import { useEffect, useState } from 'react';
function TypeDetails({ typeData, onUpdate, moduleId, index, selectedSchema, propertyName, onResolve }) {
  const [openResolve, setOpenResolve] = useState(false);
  const [resolvedName, setResolvedName] = useState('');
  const [receivedType, setReceivedType] = useState(typeData);
  const { type } = receivedType;
  const selectedType = selectionTypes[type];
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

  useEffect(() => {
    console.log('typeData::>>', typeData);
    setReceivedType(typeData);
  }, [typeData]);

  const updateTemplateInput = (val, i) => {
    const updatedType = { ...receivedType };
    updatedType.templateInputs = updatedType.templateInputs.map((input, index) => (index === i ? val : input));
    onUpdate(updatedType);
  };

  const handleResolve = async () => {
    const payload = {
      // moduleId: moduleId,
      // schemaId: selectedSchema,
      newName: resolvedName,
      schemaDetails: receivedType,
      propertyDetails: { index: index },
    };
    onResolve(payload);
    // await dispatch(resolveSchemaProperties({ projectName, payload })).unwrap();
    // await dispatch(fetchSchemas({ projectName, payload: { category: 'models', module: moduleId } })).unwrap();
    setOpenResolve(false);
  };

  return (
    <>
      <div className="row br-background-secondary">
        <div className="col-12">
          <CustomSelectField
            name="moduleSelect"
            value={type}
            onChange={(val) => changeType(val)}
            options={basicTypeTemplate}
            className="form-select br-form-select form-select-sm  "
            sendSelectedOption={true}
          />
          {type === 'object' && !openResolve && (
            <>
              {/* <i className="bi bi-exclamation-circle mt-1 mx-1" style={{ color: 'red' }}></i> */}
              <i
                className=" badge breeze-badge mt-1 bi bi-exclamation-circle br-text-primary"
                style={{ cursor: 'pointer', border: '1px solid #ffcc00' }}
                title="resolve-object-type"
                onClick={() => setOpenResolve(true)}
              >
                <span className="mx-1">Resolve </span>
              </i>
            </>
          )}
        </div>
        {openResolve && (
          <div className="row">
            <div className="col-11">
              <CustomTextInput
                name="propertyName"
                value={resolvedName}
                className={'form-control br-form-control form-control-sm my-1'}
                onChange={(val) => setResolvedName(val)}
                placeholder="Enter schema name"
              />
            </div>
            <div className="col-1 my-1">
              <i
                className=" badge breeze-badge-active br-text-primary"
                style={{ cursor: 'pointer' }}
                title="add-other-type"
                onClick={handleResolve}
              >
                <span>Resolve</span>
              </i>
            </div>
          </div>
        )}
        {/* <div>{type === 'object' && <ObjectDetails objectData={typeData} onUpdate={onUpdate} />}</div> */}
        <div className="col-12 ms-3 my-1" style={{ borderLeft: '1px solid rgba(128, 128, 128, 0.5)' }}>
          {selectedType?.templates &&
            selectedType.templates.map((val, i) => {
              return (
                <>
                  <span className="br-text-primary my-1">{val['name']}</span>
                  <Types
                    key={val['name']}
                    propertyData={receivedType.templateInputs[i]}
                    onUpdate={(value) => updateTemplateInput(value, i)}
                  />
                </>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default TypeDetails;
