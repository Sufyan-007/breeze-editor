import React, { useEffect, useState } from "react";
import { Form, Col } from "react-bootstrap";

function IfBlock({ config,update }) {
  const [conf, setConf] = useState({...config});
  

  useEffect(()=>{
    setConf({...config})
  },[config])

  function updateCondition(value){
    setConf((state)=>{
      state.condition.value = value
      return {...state}
    })
  }

  return (
    <div className="mt-3">
      <Form.Label htmlFor="ifCondition">If Condition</Form.Label>
      <Form.Group as={Col} controlId="ifCondition">
        <Form.Control
          className="form-control-sm"
          type="text"
          placeholder="condition"
          value={conf?.condition.value}
          onChange={(event)=>updateCondition(event.target.value)}
          required
        />
      </Form.Group>
      <button onClick={()=>update(conf)}>
        Update
      </button>
    </div>
  );
}

export default IfBlock;
