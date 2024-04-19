import { useRef, useState } from "react"
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { Modal, Form } from "react-bootstrap"


export default function OtherVariables({ otherVars, updateOtherVars, ...props }) {
    const [showFunctions, setShowFunctions] = useState(false)
    const [modalVar, setModalVar] = useState(null)
    const formRef = useRef()

    function closeModal(index) {
        if (index) {
            const name = formRef.current.querySelector('#name').value;
            const declarationType= "const"
            const className= ""
            var defaultValue = formRef.current.querySelector('#defaultValue').value;
            // try{
            //     defaultValue = JSON.parse(defaultValue)
            // }catch(e){}
            
            if (name) {
                const vars = [...otherVars]

                if (vars[modalVar]) {
                    const $id = vars[modalVar]["$id"]
                    const v = { name, $id , className,parameters:[defaultValue],declarationType}
                    vars[modalVar] = v
                } else {
                    const $id = "OTHER_VARS/UUID" + (otherVars.length + 1)
                    const v = { name, $id , className,parameters:[defaultValue],declarationType}
                    vars.push(v)
                }
                updateOtherVars(vars)
                setModalVar(null)
            } else {
                alert("Name cannot be empty")
            }
        }
        else {
            setModalVar(null)
        }
    }

    return (
        <div {...props}>
            <Modal show={modalVar} onHide={() => closeModal(false)}>
                <Modal.Header>
                    Prop Variable
                </Modal.Header>
                <Modal.Body>
                    <Form ref={formRef}>
                        <Form.Group>
                            <Form.Label>
                                Name
                            </Form.Label>
                            <Form.Control id="name" placeholder="Variable Name" defaultValue={otherVars[modalVar]?.name} />
                        </Form.Group>


                        <Form.Group>
                            <Form.Label>
                                Default Value 
                            </Form.Label>
                            <Form.Control id="defaultValue" as="textarea" placeholder="Default value" defaultValue={otherVars[modalVar]?.parameters[0]} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => closeModal(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => closeModal(modalVar)}>Update</button>
                </Modal.Footer>
            </Modal>

            <div className="d-flex ">
                <button className="btn  p-0 m-0  shadow-none" onClick={() => setShowFunctions((state) => !state)}>
                    {showFunctions ?
                        <img src={downArrow} height={24} alt="" />
                        :
                        <img src={rightArrow} height={24} alt="" />
                    }
                </button >
                Other Variables
            </div>
            {showFunctions ?
                <div className="col">

                    {Object.entries(otherVars).map(([index, v]) =>
                        <div key={v.name} className=" my-1 ms-3 w-75 bg-light card" onClick={() => setModalVar(index)}>
                            {v.name}
                        </div>
                    )}
                    <button className="btn btn-secondary  btn-sm m-1 ms-4" onClick={() => setModalVar(otherVars.length+1)}>
                        Add State Variable
                    </button>
                </div>
                : null
            }
        </div>
    )
}