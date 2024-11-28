import PropTypes from 'prop-types';
import { CustomButtonField, CustomSwitchField, CustomTextInput } from '../../../../common/fields';
import { useState } from 'react';
import { funcConfigTemplates } from '../../constants/functionConfigTemplates';

function IfBlockConfigForm({ onSubmit, onCancel, editMode }) {
  const initialIfConfig = JSON.parse(JSON.stringify(funcConfigTemplates['ifBlock']));
  const [formData, setFormData] = useState({ ...initialIfConfig });

  const updateCondition = (value) => {
    setFormData((state) => ({
      ...state,
      condition: {
        ...state.condition,
        value,
      },
    }));
  };

  const updateElseIfCondition = (index, value) => {
    const updatedElseIfs = formData.elseIf.map((item, idx) =>
      idx === index ? { ...item, condition: { ...item.condition, value } } : item
    );
    setFormData((state) => ({
      ...state,
      elseIf: updatedElseIfs,
    }));
  };

  const addElseIf = () => {
    setFormData((state) => ({
      ...state,
      elseIf: [
        ...state.elseIf,
        {
          condition: { type: 'CUSTOM', value: '' },
          bodyConfig: { type: 'BLOCK', statements: [] },
        },
      ],
    }));
  };

  const removeElseIf = (index) => {
    setFormData((state) => ({
      ...state,
      elseIf: state.elseIf.filter((_, idx) => idx !== index),
    }));
  };

  const toggleElseBody = () => {
    setFormData((state) => ({
      ...state,
      elseBody: state.elseBody ? null : { type: 'BLOCK', statements: [] },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editMode) setFormData(initialIfConfig);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(initialIfConfig);
    onCancel();
  };

  return (
    <form className="ifBlock-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <div>
            <CustomTextInput
              name="ifCondition"
              value={formData?.condition.value}
              onChange={(value) => updateCondition(value)}
              config={{
                label: 'If Condition',
                groupClass: 'form-group mb-2',
              }}
            />
          </div>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="br-text-primary med-font">
                <strong>Else If Conditions</strong>
              </div>
              <div className="mx-1" style={{ cursor: 'pointer' }} onClick={addElseIf}>
                <i className="bi bi-plus-circle br-text-primary"></i>{' '}
                <strong className="br-text-primary med-font"> Else If</strong>
              </div>
            </div>
            {formData.elseIf.length > 0 ? (
              <>
                {' '}
                {formData.elseIf.map((item, index) => (
                  <div key={index} className="px-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="w-100">
                        <CustomTextInput
                          name={`elseIfCondition-${index}`}
                          value={item?.condition.value}
                          onChange={(value) => updateElseIfCondition(index, value)}
                          config={{
                            label: 'else if',
                            groupClass: 'form-group mb-2',
                          }}
                        />
                      </div>
                      <div
                        className="mt-4 me-1 ms-2"
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={() => removeElseIf(index)}
                      >
                        <i className="bi bi-trash"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="br-text-primary med-font">No Else if blocks present</p>
            )}
          </div>
          <div>
            <CustomSwitchField
              name="else"
              checked={!!formData.elseBody || false}
              onChange={() => toggleElseBody()}
              config={{
                label: 'Include Else Block',
                groupClass: 'form-group form-switch me-3',
                className: 'form-check-input br-form-switch-input me-2',
              }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <CustomButtonField
            type="button"
            label={'Cancel'}
            className="btn br-secondary-button med-font mx-2"
            onClick={handleCancel}
          />
          <CustomButtonField
            type="button"
            label={editMode ? 'Update' : 'Submit'}
            className="btn btn-filled med-font"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </form>
  );
}

IfBlockConfigForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
};

export default IfBlockConfigForm;
