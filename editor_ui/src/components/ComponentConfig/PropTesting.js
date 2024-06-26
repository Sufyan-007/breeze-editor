import { useContext, useEffect, useState } from "react";
import Offcanvas from "../common/Offcanvas";
import { ComponentContext } from "./ComponentConfigPage";
import { TestPropsContext } from "./HtmlSection";
import { Button } from "react-bootstrap";
import MonacoEditor from "../common/MonacoEditor";

export default function PropTesting() {
  const { testProps, setTestProps } = useContext(TestPropsContext);
  const { componentConfig } = useContext(ComponentContext);

  const [canvasOpen, setCanvasOpen] = useState(false);
  const [formInputs, setFormInputs] = useState(() =>
    componentConfig.propsVars.reduce((acc, prop) => {
      acc[prop.name] = {
        name: prop.name,
        type: prop.body?.datatype || "string",
        value: testProps[prop.name]?.value || "",
      };
      return acc;
    }, {})
  );

  console.log(componentConfig.propsVars);

  const handleInputChange = (propName, value) => {
    setFormInputs((prevInputs) => ({
      ...prevInputs,
      [propName]: {
        ...prevInputs[propName],
        value: value,
      },
    }));
  };

  const updateProps = () => {
    setTestProps(formInputs);
    setCanvasOpen(false);
  };

  useEffect(() => {
    setFormInputs(() =>
      componentConfig.propsVars.reduce((acc, prop) => {
        acc[prop.name] = {
          name: prop.name,
          type: prop.body?.datatype || "string",
          value: testProps[prop.name]?.value || "",
        };
        return acc;
      }, {})
    );
  }, [testProps, componentConfig.propsVars]);

  return (
    <>
      <button
        className="btn btn-sm btn-secondary"
        onClick={() => setCanvasOpen(true)}
      >
        Open Prop Configuration
      </button>
      <Offcanvas
        isOpen={canvasOpen}
        width="600px"
        onClose={() => setCanvasOpen(false)}
        title="Prop configuration"
      >
        {componentConfig.propsVars.length === 0 ? (
          <div className="text-center">
            <p className="text-white">No props available</p>
          </div>
        ) : (
          componentConfig.propsVars.map((prop) => (
            <div key={prop.name} className="mb-4 row">
              <label className="col-sm-3 col-form-label text-white">
                {prop.name}:
              </label>
              <div className="col-sm-9 mt-2">
                <MonacoEditor
                  value={formInputs[prop.name]?.value || ""}
                  onChange={(value) => handleInputChange(prop.name, value)}
                  height="50px"
                  id={prop.id}
                  width="80%"
                  language="javascript"
                />
              </div>
            </div>
          ))
        )}
        <div className="d-flex justify-content-end mt-4">
          <Button
            className="btn btn-primary"
            onClick={updateProps}
            disabled={componentConfig.propsVars.length === 0}
          >
            Update
          </Button>
        </div>
      </Offcanvas>
    </>
  );
}
