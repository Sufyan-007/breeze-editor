import { Fragment, useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useParams } from "react-router";
import { getComponents } from "../services/ComponentReadService";

export default function AddChildModal({ show, update }) {
    const [components, setComponents] = useState({});
    const { projectName } = useParams()
    const [newChild, setNewChild] = useState({})


    useEffect(() => {
        const load = async () => {
            const resp = await getComponents(projectName)
            setComponents(resp)
        }
        load()
    }, [projectName])

    useEffect(() => {
        setNewChild({})
    }, [show])

    function updateNewChild(key, value) {
        if(key ==="elementType"){
            setNewChild({})
        }
        setNewChild(state => {
            return { ...state, [key]: value }
        })
    }


    function closeModal(add) {

        if (add) {
            update(newChild)
            setNewChild({})
        }
        else {
            update(null)
            setNewChild({})
        }

    }

    return (
        <Modal show={show} onHide={() => closeModal(false)}>
            <Modal.Header>
                Add Child
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Type </Form.Label>
                        <Form.Select value={newChild.elementType} onChange={(event) => updateNewChild("elementType", event.target.value)}>
                            <option value="" hidden >please select an option</option>
                            {Object.keys(components).map(component =>
                                <option value={component}>{component}</option>
                            )}
                        </Form.Select>
                    </Form.Group>
                    {newChild.elementType ?
                        <Fragment>
                            {newChild.elementType === "THIRD_PARTY" ?
                                <Fragment>
                                    <Form.Group className="mt-2">
                                        <Form.Label>
                                            Library
                                        </Form.Label>
                                        <Form.Select value={newChild.library} onChange={(event) => updateNewChild("library", event.target.value)}>
                                            <option value="" hidden>please select an option</option>
                                            {Object.keys(components[newChild.elementType]).map(library =>
                                                <option value={library}>{library}</option>
                                            )}
                                        </Form.Select>
                                    </Form.Group>
                                    {newChild.library ?
                                        <Form.Group>
                                            <Form.Label>
                                                Component
                                            </Form.Label>
                                            <Form.Select value={components[newChild.elementType][newChild.library].indexOf(newChild.component)} onChange={(event)=>updateNewChild("component",components[newChild.elementType][newChild.library][event.target.value])}>
                                                <option value="" hidden>please select an option</option>
                                                {components[newChild.elementType][newChild.library].map((comp,index) =>
                                                    <option value={index}>{comp.name}</option>
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                        : null}
                                </Fragment>
                                :
                                <Form.Group className="mt-2">
                                    <Form.Label>
                                        Component
                                    </Form.Label>
                                    <Form.Select value={components[newChild.elementType].indexOf(newChild.component)} onChange={(event)=>updateNewChild("component",components[newChild.elementType][event.target.value])}>
                                        <option value="" hidden>please select an option</option>
                                        {components[newChild.elementType].map((comp,index) =>
                                            <option value={index}>{comp.name}</option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            }
                        </Fragment>
                        : null}

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={() => closeModal(false)}>
                    Cancel
                </button>
                <button className="btn btn-primary" onClick={() => closeModal(true)}>
                    Add
                </button>
            </Modal.Footer>
        </Modal>
    )

}