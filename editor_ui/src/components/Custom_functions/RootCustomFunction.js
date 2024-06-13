import React, { useState } from "react";
import { Button, Form, Dropdown, DropdownButton } from "react-bootstrap";
import DeleteIcon from "../../assets/icons/delete.svg";
import "../../css/RootCustomFunction.css";
function Root() {
  const [parameters, setParameters] = useState([]);
  const [newParameter, setNewParameter] = useState("");
  const [vis, setvis] = useState(false);

  const [func, setFunc] = useState([
    { name: "Function 1" },
    { name: "Function 2" },
    { name: "Function 3" },
  ]);
  const [serviceFunc, setServiceFunc] = useState({
    metadata: {
      function1: {
        parameters: [{ name: "param1" }, { name: "param2" }],
      },
      function2: {
        parameters: [{ name: "param3" }],
        requestbody: "bodyData",
      },
    
    },
    service_function_name: [
      "function1",
      "function2",
      "function3"
      
    ],
  });

  const [showServiceFunc, setShowServiceFunc] = useState(false);

  //updating variables
  const [vars, setVars] = useState(["var1", "var2", "var3"]);
  const [showVars, setShowVars] = useState(false);

  const [getVars, setGetVars] = useState(["var1", "var2", "var3"]);
  const [showGetVars, setShowGetVars] = useState(false);

  //navigating to other components
  const [comps, setComps] = useState([
    "component1",
    "component2",
    "component3",
  ]);
  const [showComp, setShowComp] = useState(false);
  const [navigateUsed, setNavigateUsed] = useState(false);
  const [importStatement, setImportStatement] = useState("");

  const [isAsync, setIsAsync] = useState(true);
  const [bodyText, setBodyText] = useState("");
  const handleButtonClick = () => {
    setvis(!vis);
  };

  const buttonStyle = {
    marginRight: "10px", // Adjust the margin as needed
    padding: "5px 10px", // Adjust the padding as needed
  };

  const handleFormSubmit = (e) => {
    console.log("form submitted");
  };

  const handleAddParameter = () => {
    setParameters([...parameters, newParameter]);
    setNewParameter("");
  };
  const handleDeleteParameter = (index) => {
    // Create a copy of the parameters array
    const updatedParameters = [...parameters];
    // Remove the parameter at the specified index
    updatedParameters.splice(index, 1);
    // Update the state with the new parameters array
    setParameters(updatedParameters);
  };
  const makeServiceCall = () => {
    // setServiceFunc({
    //   service_function_name: ["Function 1", "Function 2", "Function 3"],
    // });
    setShowServiceFunc(true);
  };

  const updateStateVariable = () => {
    setShowVars(true);
  };

  const getStateVariable = () => {
    setShowGetVars(true);
  };
  const handleUpdateStateVar = (name) => {
    const camelCaseName = name.charAt(0).toUpperCase() + name.slice(1);
    setBodyText((prevBodyText) => `${prevBodyText}set${camelCaseName}();\n`);
  };

  const handleGetStateVar = (name) => {
    setBodyText((prevBodyText) => `${prevBodyText}${name} \n`);
  };

  const NavigationComp = () => {
    setShowComp(true);
  };

  const handleNavComp = (comp_name) => {
    const importStatement = `import { useNavigate } from "react-router-dom";`;
    setImportStatement(importStatement);

    setBodyText((prevBodyText) => {
      let newText = `const navigate = useNavigate();\n ${prevBodyText}`;

      newText += `navigate("/${comp_name}");\n`;
      console.log(newText); // Log the updated text
      return newText;
    });
    // Disable the Navigate button after use
    setNavigateUsed(true);
  };

  const handleError = async () => {
    setBodyText(
      (prevBodyText) =>
        `${prevBodyText} try { \n\n}catch(){ \n console.error("error"); \n}`
    );
  };

  const handleServiceFunc = (functionName) => {
    //using state updater function to update the body text in the component
    setBodyText((prevBodyText) => {
      // let newText = `${prevBodyText}try {\n`;

      //retrieves the metadata from the 'serviceFunc' metadata
      const metadata = serviceFunc.metadata || {};
      let newText = prevBodyText;
      if (metadata.hasOwnProperty(functionName)) {
        const selectedFunctionMetadata = metadata[functionName];

        const selectedFunctionParameters =
          (selectedFunctionMetadata.parameters || [])
            .map((param) => param.name)
            .join(",") ||
          selectedFunctionMetadata.requestbody ||
          "";

        if (
          selectedFunctionParameters !== "" &&
          !parameters.includes(selectedFunctionParameters)
        )
          setParameters([...parameters, selectedFunctionParameters]);

        const functionCall = `${isAsync ? "await " : ""}${functionName}(${selectedFunctionParameters}) \n`;

        // let newText = prevBodyText;

        // Check if prevBodyText contains a try-catch block
        if (prevBodyText.includes("try {")) {
          const tryBlockStartIndex = newText.lastIndexOf("try {");
          const tryBlockEndIndex = newText.indexOf("}", tryBlockStartIndex);
          newText =
            newText.slice(0, tryBlockEndIndex) +
            `const ${functionName}Res = ${functionCall}` +
            newText.slice(tryBlockEndIndex);
        } else {
          // Create a new try-catch block
          newText += "try {\n";
          newText += `const ${functionName}Res = ${functionCall}`;
          newText += "} catch (error) {\n";
          newText += "  console.error(error);\n";
          newText += "}\n";
        }

        // updateParametersInFunctionBody();
        // Append the catch block

        return newText;

        // newText += `const res = ${functionCall}`;
      } else {
        console.log(`Metadata for function '${functionName}' not found.`);
      }

      newText += "} catch (error) {\n";
      newText += "  console.error(error);\n";
      newText += "}\n";

      return newText;
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-md-2"
          style={{ background: "black", padding: "20px", height: "100vh" }}
        >
          <p className="custom-function">Functions</p>
          <ul className="list-group">
            {func.map((functionItem, index) => (
              <li key={index} className="custom-function list-group-item">
                {functionItem.name}
              </li>
            ))}
          </ul>
          <Button
            className="mt-3 mb-3"
            onClick={() => {
              handleButtonClick();
            }}
            variant="secondary"
          >
            Create custom function
          </Button>
        </div>

        <div className="col-md-9" style={{ padding: "20px" }}>
          {vis ? (
            <Form onSubmit={handleFormSubmit}>
              <Form.Group className="custom-function mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Function Name
                </Form.Label>
                <Form.Control
                  className="custom-function-form-control"
                  type="text"
                  name="functionName"
                  placeholder="Name of the Custom Function"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a function name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="custom-function mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Parameters
                </Form.Label>
                <div className="d-flex">
                  <Form.Control
                    className="custom-function-form-control"
                    type="text"
                    name="parameter"
                    placeholder="Add parameter"
                    value={newParameter}
                    onChange={(e) => setNewParameter(e.target.value)}
                  ></Form.Control>
                  <Button variant="secondary" onClick={handleAddParameter}>
                    Add Parameter
                  </Button>
                </div>

                <ul>
                  {parameters.map((param, index) => (
                    <li
                      key={index}
                      className="custom-function-form-control mt-3"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #ccc",
                        padding: "8px",
                        marginBottom: "8px",
                        background: "#F0F8FF",
                        width: "500px",
                        justifyContent: "space-between",
                      }}
                    >
                      {param}
                      <Button
                        style={{ marginRight: "8px", cursor: "pointer" }}
                        onClick={() => handleDeleteParameter(index)}
                      >
                        <img
                          className="mx-2"
                          src={DeleteIcon}
                          alt="Delete"
                          style={{
                            cursor: "pointer",
                            width: "20px",
                            height: "20px",
                          }}
                        />
                      </Button>
                    </li>
                  ))}
                </ul>
              </Form.Group>
              <Form.Check
                className="custom-function mb-3"
                type="checkbox"
                id="default-checkbox"
                name="isAsync"
                label="Is the function Async ?"
                checked={isAsync}
                onChange={(e) => setIsAsync(e.target.checked)}
              />
              <div className="custom-function" style={{ fontWeight: "bold" }}>
                Actions - 
              </div>
              <div className="d-flex">
                <div className="row mb-3 mt-3">
                  <div className="col-md-3">
                    <Button
                      variant="secondary"
                      onClick={makeServiceCall}
                      style={buttonStyle}
                    >
                      Make a Service Call
                    </Button>
                    {showServiceFunc && (
                      <div className="mt-3" style={{ padding: "10px" }}>
                        <DropdownButton
                          title="Select Function"
                          variant="secondary"
                          onSelect={(functionName) =>
                            handleServiceFunc(functionName)
                          }
                        >
                          {serviceFunc.service_function_name &&
                            serviceFunc.service_function_name.map(
                              (functionName, index) => (
                                <Dropdown.Item
                                  key={index}
                                  eventKey={functionName}
                                >
                                  {functionName}
                                </Dropdown.Item>
                              )
                            )}
                        </DropdownButton>
                      </div>
                    )}
                  </div>

                  <div className="col-md-3">
                    <Button
                      variant="secondary"
                      onClick={updateStateVariable}
                      style={buttonStyle}
                    >
                      Set State Variables
                    </Button>
                    {showVars && (
                      <div className="mt-3" style={{ padding: "10px" }}>
                        <DropdownButton
                          title="Select Variable"
                          variant="secondary"
                          onSelect={(name) => handleUpdateStateVar(name)}
                        >
                          {vars &&
                            vars.map((name, index) => (
                              <Dropdown.Item key={index} eventKey={name}>
                                {name}
                              </Dropdown.Item>
                            ))}
                        </DropdownButton>
                      </div>
                    )}
                  </div>

                  <div className="col-md-3">
                    <Button
                      variant="secondary"
                      onClick={getStateVariable}
                      style={buttonStyle}
                    >
                      Get State Variables
                    </Button>
                    {showGetVars && (
                      <div className="mt-3" style={{ padding: "10px" }}>
                        <DropdownButton
                          title="Select Variable"
                          variant="secondary"
                          onSelect={(name) => handleGetStateVar(name)}
                        >
                          {getVars &&
                            getVars.map((name, index) => (
                              <Dropdown.Item key={index} eventKey={name}>
                                {name}
                              </Dropdown.Item>
                            ))}
                        </DropdownButton>
                      </div>
                    )}
                  </div>

                  <div className="col-md-3">
                    <Button
                      variant="secondary"
                      onClick={NavigationComp}
                      style={buttonStyle}
                    >
                      Navigate to Components
                    </Button>
                    {showComp && (
                      <div className="mt-3" style={{ padding: "10px" }}>
                        <DropdownButton
                          className="custom-dropdown-button"
                          title="Select Component"
                          variant="secondary"
                          onSelect={(comp_name) => handleNavComp(comp_name)}
                        >
                          {comps &&
                            comps.map((name, index) => (
                              <Dropdown.Item
                                key={index}
                                eventKey={name}
                                disabled={navigateUsed}
                              >
                                {name}
                              </Dropdown.Item>
                            ))}
                        </DropdownButton>
                      </div>
                    )}
                  </div>
                  <div className="col-md-3">
                    <Button
                      variant="secondary"
                      className="mt-3"
                      onClick={handleError}
                      style={buttonStyle}
                    >
                      Error Handling
                    </Button>
                  </div>
                </div>
              </div>
              <Form.Group className="custom-function mb-3">
                <Form.Label style={{ fontWeight: "bold" }}>
                  Body of the function
                </Form.Label>
                <Form.Control
                  className="custom-function-form-control"
                  name="body"
                  as="textarea"
                  rows={3}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  style={{ height: "200px" }}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter the function body.
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="secondary" type="submit">
                Submit
              </Button>
            </Form>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
}
export default Root;
