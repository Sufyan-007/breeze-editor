import React, { useState } from "react";
import Offcanvas from "../../../common/Offcanvas";
import AddFunctionItem from "./AddFunctionItem";
import { Button } from "react-bootstrap";

function FunctionConfigStack({ config }) {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [formResponse, setFormResponse] = useState(null);

  const handleClose = () => {
    setIsOffcanvasOpen(false);
  };

  const handleOpen = () => {
    setIsOffcanvasOpen(true);
  };

  function Declaration({ declarationType, varName, value }) {
    return (
      <div className="declaration border border-light px-2 py-1">
        <strong>{declarationType}:</strong> {varName} ={" "}
        {value && value.type === "STRING" ? value.value : JSON.stringify(value)}
      </div>
    );
  }

  // Assignment component
  function Assignment({ varName, value }) {
    return (
      <div className="assignment border border-light px-2 py-1">
        <strong>Assignment:</strong> {varName} ={" "}
        {value && value.type === "STRING" ? value.value : JSON.stringify(value)}
      </div>
    );
  }

  // FunctionCall component
  function FunctionCall({ functionName, parameters }) {
    return (
      <div className="function-call border border-light px-2 py-1">
        <strong>Function Call:</strong> {functionName}(
        {parameters.map((param, index) => param.value).join(", ")})
      </div>
    );
  }

  // IfBlock component
  function IfBlock({ condition, bodyConfig, elseBody }) {
    return (
      <div className="if-block border border-light px-2 py-1">
        <strong>If:</strong>{" "}
        {condition.operand1.value +
          " " +
          condition.operation +
          " " +
          condition.operand2.value}
        <div className="px-3">
          <FunctionConfigStack config={bodyConfig} />
        </div>
        {elseBody && (
          <>
            <strong>Else:</strong>
            <div className="px-3">
              <FunctionConfigStack config={elseBody} />
            </div>
          </>
        )}
      </div>
    );
  }

  // WhileBlock component
  function WhileBlock({ condition, bodyConfig }) {
    return (
      <div className="while-block border border-light px-2 py-1">
        <strong>While:</strong>{" "}
        {condition.operand1.value +
          " " +
          condition.operation +
          " " +
          condition.operand2.value}
        <div className="px-3">
          <FunctionConfigStack config={bodyConfig} />
        </div>
      </div>
    );
  }

  // Return component
  function Return({ value }) {
    return (
      <div className="return border border-light px-2 py-1">
        <strong>Return:</strong> {JSON.stringify(value)}
      </div>
    );
  }

  const componentMap = {
    DECLARATION: Declaration,
    ASSIGNMENT: Assignment,
    FUNCTION_CALL: FunctionCall,
    IF_BLOCK: IfBlock,
    WHILE_BLOCK: WhileBlock,
    RETURN: Return,
  };

  const renderStatements = (statements) => {
    
    return statements.map((statement, index) => {
      const Component = componentMap[statement.type];
      if (Component) {
        return <Component key={index} {...statement} />;
      }
      return null;
    });
  };

  const handleFunctionItemChange = React.useCallback((value) => {
    setFormResponse(value);
  }, []);

  const handleSubmit = () => {
    console.log("data::>>", formResponse);
    handleClose();
  };

  // console.log("config::>>", config);

  return (
    <div>
      <div
        className="d-flex justify-content-between mt-1"
        style={{ fontSize: "14px" }}
      >
        <div>Add function</div>
        <div className="" style={{ cursor: "pointer" }} onClick={handleOpen}>
          <i className="bi bi-plus-circle"></i>
        </div>
      </div>
      <div className="function-config-stack mt-1" style={{ fontSize: "14px" }}>
        {config &&
          config.type === "BLOCK" &&
          renderStatements(config.statements)}
      </div>
      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={handleClose}
        title={"Add Function"}
        width="40%"
        footer={
          <div className="d-flex justify-content-between">
            <Button
              variant="success"
              size="sm"
              onClick={() => handleSubmit(formResponse)}
            >
              Save
            </Button>
            <Button variant="danger" size="sm" className="ml-auto" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        }
      >
        <div className="px-1">
          <AddFunctionItem onChange={handleFunctionItemChange} />
        </div>
      </Offcanvas>
    </div>
  );
}

export default FunctionConfigStack;
