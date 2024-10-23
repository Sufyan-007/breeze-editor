import Types from './Types';
import { basicTypeTemplate, objectTemplate, typeWithTemplateInput } from '../constants/templates';
import ObjectDetails from './ObjectDetails';
import { CustomSelectField } from '../../../common/fields';
import { selectionTypes } from '../constants/templates';
function TypeDetails({ typeData, onUpdate }) {
  const { type } = typeData;
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

  const updateTemplateInput = (val, i) => {
    const updatedType = { ...typeData };
    updatedType.templateInputs = updatedType.templateInputs.map((input, index) => (index === i ? val : input));
    onUpdate(updatedType);
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
        </div>
        <div>{type === 'object' && <ObjectDetails objectData={typeData} onUpdate={onUpdate} />}</div>
        <div className="col-12 ms-3 my-1" style={{ borderLeft: '1px solid rgba(128, 128, 128, 0.5)' }}>
          {selectedType?.templates &&
            selectedType.templates.map((val, i) => {
              return (
                <>
                  <span className="br-text-primary my-1">{val['name']}</span>
                  <Types
                    key={val['name']}
                    propertyData={typeData.templateInputs[i]}
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
