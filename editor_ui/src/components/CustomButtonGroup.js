import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { Col, Form, Row } from "react-bootstrap";
import CustomButtonGroupCss from "../css/CustomButtonGroup.css";

const CustomButtonGroup = ({
  selectedButton,
  formId,
  title,
  options,
  onButtonClick,
  width,
}) => {
  return (
    <>
      <ButtonGroup
        // style={{ width: options[0].width ? options[0].width : "80%" }}
        style={{ width: width }}
        className="custom-button-group"
      >
        {options.map((option) => {
          return (
            <Button
              variant={option.variant}
              onClick={() => onButtonClick(option.name)}
              active={selectedButton === option.name}
            >
              {option.label}
            </Button>
          );
        })}
      </ButtonGroup>
    </>
  );
};

export default CustomButtonGroup;
