import React from 'react'
import { Form } from 'react-bootstrap'

const TextELement = ({textValue,handleTextChange}) => {
  return (
      
                <>
                <Form.Control 
                    as="textarea" 
                    placeholder=""  
                    className="m-auto mt-4 mb-3 ps-3 pe-4" 
                    value={textValue} 
                    onChange={handleTextChange} 
                    style={{ height: '100px' , width:'95%' }}
                     />
                      <span className="textarea" role="textbox" ></span>
                      </>

            
  )
}

export default TextELement
