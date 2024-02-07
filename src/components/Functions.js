import { useRef, useState } from "react"
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { Modal, Form } from "react-bootstrap"


export default function Functions({ functions, updateFunctions, ...props }) {
    const [showFunctions, setShowFunctions] = useState(false)
    const [modalFunc, setModalFunc] = useState(null)
    const formRef = useRef()

    function closeModal(index) {
        if (index) {
            const name = formRef.current.querySelector('#name').value;

            const params = formRef.current.querySelector('#parameters').value
            const list = params.split(/[\s,]+/).filter(value => value.trim() !== '').map(name => { return { name } })
            const parameters = { list }
            const isAnonymous = formRef.current.querySelector('#isAnonymous').checked;
            const isAsync = formRef.current.querySelector('#isAsync').checked;
            const body = formRef.current.querySelector('#body').value;
            if (name) {
                const funcs = [...functions]
                if (funcs[index]) {
                    const id = funcs[index]["$id"]
                    const f = { name, "$id":id, parameters, isAnonymous, isAsync, body }
                    funcs[index] = f
                } else {
                    const id = "FUNCTIONS/UUID" + (functions.length + 1)
                    const f = { name, "$id":id, parameters, isAnonymous, isAsync, body }
                    funcs.push(f)
                }
                console.log(funcs)
                updateFunctions(funcs)
                setModalFunc(null)
            } else {
                alert("Name cannot be empty")
            }
        }
        else {
            setModalFunc(null)
        }
    }

    return (
        <div {...props}>
            <Modal show={modalFunc} onHide={() => closeModal(false)}>
                <Modal.Header>
                    Functions
                </Modal.Header>
                <Modal.Body>
                    <Form ref={formRef}>
                        <Form.Group>
                            <Form.Label>
                                Function Name
                            </Form.Label>
                            <Form.Control id="name" placeholder="Function name" defaultValue={functions[modalFunc]?.name} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>
                                Parameters (csv)
                            </Form.Label>
                            <Form.Control id="parameters" placeholder="parameters" defaultValue={functions[modalFunc]?.parameters.list.map(item => item.name).join(', ')} />
                        </Form.Group>

                        <Form.Check id="isAnonymous" className="my-3" defaultChecked={functions[modalFunc]?.isAnonymous} label="isAnonymous" />

                        <Form.Check id="isAsync" className="my-3" defaultChecked={functions[modalFunc]?.isAsync} label="isAsync" />


                        <Form.Group>
                            <Form.Label>
                                Function Body
                            </Form.Label>
                            <Form.Control id="body" as="textarea" rows={10} placeholder="Function name" defaultValue={functions[modalFunc]?.body} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => closeModal(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => closeModal(modalFunc)}>Update</button>
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
                Functions
            </div>
            {showFunctions ?
                <div className="col">

                    {Object.entries(functions).map(([index, func]) =>
                        <div key={func.name} className=" my-1 ms-3 w-75 bg-light card" onClick={() => setModalFunc(index)}>
                            {func.name}
                        </div>
                    )}
                    <button className="btn btn-secondary row w-50 btn-sm m-1 ms-4" onClick={() => setModalFunc(functions.length+1)}>
                        Add Function
                    </button>
                </div>
                : null
            }
        </div>
    )
}