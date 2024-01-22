import { useState } from "react"
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import threeDots from "../assets/icons/three_dots_icon.svg"
import React from "react"
import { Modal, Button, Form, } from "react-bootstrap"

export default function Html({ Val, changeParent, ...props }) {

    const [value, setValue] = useState(Val)

    const [showChild, setShowChild] = useState(false)
    const hasChildren = value.children?.length > 0
    const [showModal, setShowModal] = useState(false)

    function toggleShowChild() {
        setShowChild((showChild) => !showChild)
    }

    function closeModal(update) {
        if (update) {
            changeParent(value)
        } else {
            setValue(Val)
        }
        setShowModal(false)
    }

    function openModal() {
        setShowModal(true)
    }

    function updateValue(key, val) {

        setValue((value) => {
            return { ...value, [key]: val }
        })
    }

    function updateAttribute(key, val) {
        const res = { type: "LITERAL", value: val }
        const attributes = { ...value.attributes, [key]: res }
        setValue(value => {
            const newVal = { ...value, attributes }
            return newVal
        })

    }

    function updateChild(key, child, offset=0) {
        console.log(offset)
        const index= key>0? key+offset:0
        const children = [...value.children]
        children.splice(key, 1)

        if (child) {
            children.splice(index,0,child)
        }

        setValue(value => {
            const newVal = { ...value, children }
            changeParent(newVal)
            console.log(newVal)
            return newVal
        })
        if(!child || offset!==0){
            setShowChild(false)
        }

    }
    function updateText(text) {
        setValue(value => {
            return { ...value, text }
        })
    }

    function addText() {
        const text = { "type": "text", "text": "Hello world" }
        const children = [...value.children, text]
        setValue(value => {
            return { ...value, children }
        })
    }

    function addChild() {
        const newDiv = {
            "type": "Element",
            "attributes": { "className": { "type": "LITERAL", "value": "" } },
            "tagName": "div",
            "children": []
        }
        const children = [...value.children, newDiv]
        setValue(value => {
            const newVal= { ...value, children }
            changeParent(newVal)
            return newVal
        })
        setShowChild(true)

    }

    if (value.type === 'Element') {
        return (
            <div {...props} >
                <Modal show={showModal} onHide={() => { closeModal(false) }}>
                    <Modal.Header>
                        {value.tagName}
                    </Modal.Header>
                    <Modal.Body>
                        <Form >
                            <Form.Group >
                                <Form.Label>
                                    Tag
                                </Form.Label>
                                <Form.Control placeholder="name" value={value.tagName} onChange={(event) => { updateValue("tagName", event.target.value) }} />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>
                                    ClassName
                                </Form.Label>
                                <Form.Control placeholder="className" value={value.attributes.className?.value} onChange={(event) => { updateAttribute("className", event.target.value) }} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { closeModal(false); }} >
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => { closeModal(true); }}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="my-1 p-0 d-flex" style={{ height: "2rem" }} >
                    {hasChildren ?
                        <button className="btn p-0 m-0 h-75 shadow-none" onClick={toggleShowChild} >
                            {showChild ?
                                <img src={downArrow} className="h-100" alt="" />
                                :
                                <img src={rightArrow} className="h-100" alt="" />
                            }
                        </button>
                        :
                        <div className="ms-4" />
                    }
                    <div className="w-100 card d-flex justify-content-between flex-row">
                        <div>{value.tagName}</div>
                        {/* <button className="btn p-0 mx-1" onClick={openModal}>
                            <img className=" h-75 " src={threeDots} alt="" />
                        </button> */}
                        <div className=" dropdown ">
                            <button className="btn p-0 mx-1"

                                data-toggle="dropdown"
                            >
                                <img className=" h-75 " src={threeDots} alt="" />
                            </button>
                            <div className="dropdown-menu p-0 my-1 " aria-labelledby="dropdownMenuButton">
                                <div className="dropdown-item my-1 " onClick={openModal} >
                                    Edit
                                </div>
                                <div className="dropdown-item my-1  " onClick={addChild} >
                                    Add Child
                                </div>
                                <div className="dropdown-item my-1  " onClick={addText} >
                                    Add Text
                                </div>
                                <div className="dropdown-item my-1  " onClick={()=>{changeParent(value,-1)}} >
                                    Move Up
                                </div>
                                <div className="dropdown-item my-1  " onClick={()=>{changeParent(value,1)}}>
                                    Move Down
                                </div>

                                <div className="dropdown-item my-1 bg-danger " onClick={() => { changeParent(null) }} >
                                    Remove
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
                {
                    hasChildren && showChild ?
                        <div className="col ms-2 m-0 border-2 border-start border-1 border-black ">
                            {value.children.map((child, index) => <Html key={index} Val={child} className="row" changeParent={(Val,offest=0) => updateChild(index, Val,offest)} />)}
                        </div> :
                        null
                }
            </div >
        )
    }
    else {
        return (
            <div {...props}>
                <Modal show={showModal} onHide={() => { closeModal(false) }}>
                    <Modal.Header>
                        text
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>text content</Form.Label>
                            <Form.Control as="textarea" rows={3} value={value.text} onChange={(event) => { updateText(event.target.value) }} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { closeModal(false); }} >
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => { closeModal(true); }}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="my-1 p-0 d-flex" style={{ height: "2rem" }} >
                    <div className=" ms-4" />
                    <div className="w-100 card d-flex justify-content-between flex-row">
                        <div>Text</div>
                        <div className=" dropdown ">
                            <button className="btn p-0 mx-1"

                                data-toggle="dropdown"
                            >
                                <img className=" h-75 " src={threeDots} alt="" />
                            </button>
                            <div className="dropdown-menu p-0 my-1 " aria-labelledby="dropdownMenuButton">
                                <div className="dropdown-item my-1 " onClick={openModal} >
                                    Edit
                                </div>
                                <div className="dropdown-item my-1  " onClick={()=>{changeParent(value,-1)}}>
                                    Move Up
                                </div>
                                <div className="dropdown-item my-1  " onClick={()=>{changeParent(value,1)}} >
                                    Move Down
                                </div>
                                <div className="dropdown-item my-1 bg-danger " onClick={() => { changeParent(null) }} >
                                    Remove
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}