import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import CustomTextField from "./CustomTextField";
import CustomButton from "./CustomButton";
import CustomTextArea from "./CustomTextarea";
import CustomFormGroupCss from "../css/CustomFormGroup.css";
import CustomLayoutCss from "../css/CustomLayout.css";
import CustomCheckbox from "./CustomCheckbox";
import CustomButtonGroup from "./CustomButtonGroup";
import CustomDropdown from "./CustomDropdown";

const CustomFormGroup = ({ controls, inline }) => {
  if (inline) {
    return (
      <div className="d-flex">
        {controls.map((control, index) => (
          <div key={index} className="row">
            <div className={`col-${control.labelColWidth}`}>
              <label className="label" htmlFor={control.id}>
                {control.label}
              </label>
            </div>
            {control.type === "text" && (
              <div className={`col-${control.inputColWidth}`}>
                <CustomTextField
                  value={control.value}
                  onChange={control.onChange}
                  placeholder={control.placeholder}
                  width={control.width}
                  type={control.type}
                />
              </div>
            )}
            {control.type === "buttongroup" && (
              <div className={`col-${control.inputColWidth}`}>
                <CustomButtonGroup
                  options={control.buttonGroupOptions}
                  selectedButton={control.selectedButton}
                  onButtonClick={control.onButtonClick}
                  formId={control.formId}
                  width={control.width}
                />
              </div>
            )}
            {control.type === "dropdown" && (
              <div className={`col-${control.inputColWidth}`}>
                <CustomDropdown
                  options={control.dropdownOptions}
                  onSelect={control.onSelect}
                />
              </div>
            )}
            {control.type === "button" && (
              <CustomButton label={control.label} onClick={control.onClick} />
            )}
            {control.type === "textarea" && (
              <CustomTextArea
                label={control.label}
                onChange={control.onChange}
                placeholder={control.placeholder}
              />
            )}
            {control.type === "checkbox" && (
              <CustomCheckbox
                checked={control.checked}
                onChange={control.onChange}
                id={control.id}
              />
            )}
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div>
        {controls.map((control, index) => (
          // <div className="custom-grid" key={index}>
          <div key={index}>
            <div className="row">
              <div className={`col-${control.labelColWidth}`}>
                <label className="label" htmlFor={control.id}>
                  {control.label}
                </label>
              </div>
              {control.type === "text" && (
                <div className={`col-${control.inputColWidth}`}>
                  <CustomTextField
                    value={control.value}
                    onChange={control.onChange}
                    placeholder={control.placeholder}
                    width={control.width}
                    type={control.type}
                  />
                </div>
              )}
              {control.type === "buttongroup" && (
                <div className={`col-${control.inputColWidth}`}>
                  <CustomButtonGroup
                    options={control.buttonGroupOptions}
                    selectedButton={control.value}
                    onButtonClick={control.onButtonClick}
                    formId={control.formId}
                  />
                </div>
              )}
              {control.type === "dropdown" && (
                <div className={`col-${control.inputColWidth}`}>
                  <CustomDropdown
                    options={control.dropdownOptions}
                    onSelect={control.onSelect}
                  />
                </div>
              )}
              {control.type === "button" && (
                <CustomButton label={control.label} onClick={control.onClick} />
              )}
              {control.type === "textarea" && (
                <div className={`col-${control.inputColWidth}`}>
                  <CustomTextArea
                    label={control.label}
                    onChange={control.onChange}
                    placeholder={control.placeholder}
                  />
                </div>
              )}
              {control.type === "checkbox" && (
                <div className={`col-${control.inputColWidth}`}>
                  <CustomCheckbox
                    checked={control.checked}
                    onChange={control.onChange}
                    id={control.id}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default CustomFormGroup;
