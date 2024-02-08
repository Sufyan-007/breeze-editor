import { useRef, useState } from "react"
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { Modal, Form } from "react-bootstrap"


export default function Hooks({ comp, updateHooks, ...props }) {
    const hooks = comp.hooks
    const functions = comp.functions
    const [showHooks, setShowHooks] = useState(false)
    const [modalVar, setModalVar] = useState(null)
    const formRef = useRef()

    function closeModal(index) {
        if (index) {
            const name = formRef.current.querySelector('#hook-name').value;
            const params = formRef.current.querySelector('#dependant').value
            const dependantVars = params.split(/[\s,]+/).filter(value => value.trim() !== '')
            const $ref = formRef.current.querySelector("#function-ref").value
            const implementation = { "type": "FUNCTION", $ref }


            if (name) {
                const newHooks = [...hooks]
                const h = { name, "type": "USE_EFFECT", dependantVars, implementation }
                if (newHooks[modalVar]) {
                    newHooks[modalVar] = h
                } else {
                    newHooks.push(h)
                }
                updateHooks(newHooks)
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
                    Functions
                </Modal.Header>
                <Modal.Body>
                    <Form ref={formRef}>
                        <Form.Group>
                            <Form.Label>
                                Name
                            </Form.Label>
                            <Form.Control id="hook-name" placeholder="Hook name" defaultValue={hooks[modalVar]?.name} />
                        </Form.Group>


                        <Form.Group>
                            <Form.Label>
                                Dependant Variables (csv)
                            </Form.Label>
                            <Form.Control id="dependant" placeholder="parameters" defaultValue={hooks[modalVar]?.dependantVars.join(', ')} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>
                                Callback Function
                            </Form.Label>
                            <Form.Select id="function-ref" placeholder="Hook name" defaultValue={hooks[modalVar]?.$ref} >
                                {Object.entries(functions).map(([index, func]) =>
                                    <option key={index} value={func.$id}>{func.name}</option>
                                )}
                            </Form.Select>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => closeModal(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => closeModal(modalVar)}>Update</button>
                </Modal.Footer>
            </Modal>

            <div className="d-flex ">
                <button className="btn  p-0 m-0  shadow-none" onClick={() => setShowHooks((state) => !state)}>
                    {showHooks ?
                        <img src={downArrow} height={24} alt="" />
                        :
                        <img src={rightArrow} height={24} alt="" />
                    }
                </button >
                Life cycle
            </div>
            {showHooks ?
                <div className="col">

                    {Object.entries(hooks).map(([index, hook]) =>
                        <div key={hook.name} className=" my-1 ms-3 w-75 bg-light card" onClick={() => setModalVar(index)}>
                            {hook.name ?? "[no-name]"}
                        </div>
                    )}
                    <button className="btn btn-secondary  btn-sm m-1 ms-4" onClick={() => setModalVar(hooks.length + 1)}>
                        Add Hooks
                    </button>
                </div>
                : null
            }
        </div>
    )
}