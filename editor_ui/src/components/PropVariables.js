import { useRef, useState } from "react"
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { Modal, Form } from "react-bootstrap"


export default function PropVariables({ propVars, updatePropVars, ...props }) {
    const [showFunctions, setShowFunctions] = useState(false)
    const [modalVar, setModalVar] = useState(null)
    const formRef = useRef()

    function closeModal(index) {
        if (index) {
            const name = formRef.current.querySelector('#name').value;
            
            if (name) {
                const vars = [...propVars]

                if (vars[modalVar]) {
                    const $id = vars[modalVar]["$id"]
                    const v = { name, $id }
                    vars[modalVar] = v
                } else {
                    const $id = "PROP_VARS/UUID" + (propVars.length + 1)
                    const v = { name,$id }
                    vars.push(v)
                }
                updatePropVars(vars)
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
                            <Form.Control id="name" placeholder="Variable Name" defaultValue={propVars[modalVar]?.name} />
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
                Prop Variables
            </div>
            {showFunctions ?
                <div className="col">

                    {Object.entries(propVars).map(([index, stateVar]) =>
                        <div key={stateVar.name} className=" my-1 ms-3 w-75 bg-light card" onClick={() => setModalVar(index)}>
                            {stateVar.name}
                        </div>
                    )}
                    <button className="btn btn-secondary  btn-sm m-1 ms-4" onClick={() => setModalVar(propVars.length+1)}>
                        Add State Variable
                    </button>
                </div>
                : null
            }
        </div>
    )
}