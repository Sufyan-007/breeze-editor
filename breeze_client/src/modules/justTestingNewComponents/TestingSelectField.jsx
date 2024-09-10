import React, { useState } from "react";
import SelectField from "../../common/fields/f.select"


// check prefix
// check for sufix if possible

function TestingSelectField() {
  React.useEffect(() => console.log(1), []);
  const singleSelectConfig = {
    multiple: false,
    options: [['name', 'jap'], ['age', 23]],
    emptyText: "select an option"
  }
  const multiSelectConfig = {
    multiple: true,
    options: [['name', 'patel'], ['age', 24]]
  }
  const [details, setDetails] = useState({})
  const getDetails = (name, value, path, node) => {
    console.log(name, node);
    console.log(value);
    console.log(path);
    setDetails({ [node[0]]: [node[1]] })
  }
  // console.log(details);
  const [multiDetails, setMultiDetailsetails] = useState({})
  const getMultiDetails = (name, values, path, node) => {
    console.log(name, node);
    console.log(values);
    console.log(path);
    if(node) setMultiDetailsetails({ recentNode: {[node[0]]: [node[1]]}, selectedValues : [...values] })
  }
  console.log(multiDetails);
  
  return (
    <div className="container-fluid">
      Breeze studio
      <span className="bg-primary"><i className="bi bi-plus"></i></span>
      <div>
      details - {Object.values(details)}
      </div>
      <span>
      multidetails - {Object.values(multiDetails?.recentNode || {})}
      </span>
      <SelectField 
        config={singleSelectConfig}
        onUpdate={getDetails}
        path=""
        name="single-select-test"
        value={details?.name || ""}
        readOnly={false}
        template=""
        ItemTemplate=""
        styleClass=""
      />
      <SelectField 
        config={multiSelectConfig}
        onUpdate={getMultiDetails}
        path=""
        name="multi-select-test"
        value={multiDetails?.selectedValues || ""}
        readOnly={false}
        template=""
        ItemTemplate=""
        styleClass=""
      />
    </div>
  );
}

export default TestingSelectField;
