import { useRef, useState } from "react"
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { Form, Modal } from "react-bootstrap"

export default function Imports({imports, updateImports, ...props }) {
    const [showImports, setShowImports] = useState(false)
    const [modalVar, setModalVar ] = useState(null)
    const otherImports = [...imports.other]
    const formRef= useRef()
    
    function closeModal(add){
        if (add){
            const import_entity = formRef.current.querySelector("#entity").value
            const import_type=  formRef.current.querySelector("#full_import").checked?"FULL":"SINGLE"
            const from = formRef.current.querySelector("#from").value
            const imp ={import_entity,import_type,from,"TYPE":"THIRD_PARTY"}

            if(!import_entity||!from){
                alert("Invalid import")
                return
            }

            if (otherImports[modalVar]){
                otherImports[modalVar]=imp
            }else{
                otherImports.push(imp)
            }
            updateImports({...imports,other:otherImports})
            setModalVar(null)
        }
        else{
            setModalVar(null)
        }
    }

    return (
        <div {...props}>
            <Modal show={modalVar} onHide={()=>closeModal(false)}>
                <Modal.Title>
                    Import Entity
                </Modal.Title>
                <Modal.Body>
                    <Form ref={formRef}>
                        <Form.Group>
                            <Form.Label>
                                Entity
                            </Form.Label>
                            <Form.Control id="entity" placeholder="entity" defaultValue={otherImports[modalVar]?.import_entity} />
                        </Form.Group>
                        <Form.Check id="full_import" type="checkbox" label="Full import" defaultChecked={otherImports[modalVar]?.import_type==="FULL"}/>
                        <Form.Group>
                            <Form.Label>
                                From
                            </Form.Label>
                            <Form.Control id="from" placeholder="from" defaultValue={otherImports[modalVar]?.from} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={()=>closeModal(false)}> 
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={()=>closeModal(true)}>
                        Update
                    </button>
                </Modal.Footer>
            </Modal>
            <div className="d-flex ">
                <button className="btn  p-0 m-0  shadow-none" onClick={() => setShowImports((state) => !state)}>
                    {showImports ?
                        <img src={downArrow} height={24} alt="" />
                        :
                        <img src={rightArrow} height={24} alt="" />
                    }
                </button>
                Imports
            </div>
            {showImports ?
                <div className="col">
                    {Object.entries(otherImports).map(([index, v]) =>
                        <div key={v.import_entity} className=" my-1 ms-3 w-75 bg-light card" onClick={()=>setModalVar(index)}>
                            {v.import_entity}
                        </div>
                    )}
                    <button className="btn btn-secondary  btn-sm m-1 ms-4" onClick={()=>setModalVar(otherImports.length+1)}>
                        Add Import
                    </button>
                </div>

                : null}
        </div>
    )
}