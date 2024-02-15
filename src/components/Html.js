import { Fragment, useRef , useState } from "react"

import HtmlTree from "./HtmlTree"
import { Form, Modal } from "react-bootstrap"
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import threeDots from "../assets/icons/three_dots_icon.svg"
export default function Html({value,selecteElement,config,reference,component,setValue,changeParent,sidebarService,selected }) {



    const [showChild, setShowChild] = useState(false)
    const tagInput = useRef()

    const [showModal, setShowModal] = useState(false)
    const hasChildren = value.children?.length > 0

    function toggleShowChild() {
        setShowChild((showChild) => !showChild)
    }
    function handleHover(highlight) {
        // Cors issue here with iFrame

        const iFrame = document.getElementById("iFrame")
        const id = value.attributes?.id?.value

        if (iFrame && id) {
            iFrame.contentWindow.postMessage({ id, highlight }, '*')
        }
    }

    function addText() {
        const text = { "type": "text", "text": "Hello world" }
        const children = [...value.children, text]
        setValue(value => {
            return { ...value, children }
        })
        setShowChild(true)
    }
    function updateChild(key, child, offset = 0, importComp = null) {

        const index = key > 0 ? key + offset : 0
        const children = [...value.children]
        children.splice(key, 1)

        if (child) {
            children.splice(index, 0, child)
        }

        setValue(value => {
            const newVal = { ...value, children }
            changeParent(newVal, 0, importComp)
            return newVal
        })
    }

    function closeModal(add) {
        if (add) {
            const tagName = tagInput.current.value
            var newDiv;
            var imp;

            const id = (value.attributes.id?.value ?? "NA") + "-" + value.children.length

            if (tagName === "EXPRESSION") {
                console.log("Expression")
                newDiv = {
                    "type": "Expression",
                    id,
                    "children": [{
                            "type": "code",
                            "code": "0"
                        }]
                }
            }
            else {
                imp = tagName !== "div" ? tagName : null
                newDiv = {
                    "type": "Element",
                    "attributes": {
                        "className": { "type": "LITERAL", "value": "" },
                        "id": { "type": "LITERAL", "value": id },
                    },
                    "tagName": tagName,
                    "children": []
                }
            }

            sidebarService.setSelectedElem(newDiv)
            const children = [...value.children, newDiv]
            setValue(value => {
                const newVal = { ...value, children }
                changeParent(newVal, 0, imp)
                return newVal
            })

            setShowChild(true)
            setShowModal(false)
        }
        else {
            setShowModal(false)
        }
    }


    function addChild() { setShowModal(true) }

    function moveUp() { changeParent(value, -1) }

    function moveDown() { changeParent(value, 1) }

    function removeElem() { if (selected.current) { sidebarService.setSelectedElem(null) }; changeParent(null) }


    return (
        <Fragment >
            <Modal show={showModal} onHide={() => closeModal(false)}>
                <Modal.Header>
                    Add Child
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Component </Form.Label>
                            <Form.Select ref={tagInput}>
                                <option value="div">div</option>
                                <option value="EXPRESSION">EXPRESSION</option>
                                {Object.keys(config).map((comp) =>
                                    <option value={comp}>{comp}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
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
            <div ref={reference} className=" p-0 d-flex justify-content-between "  >
                <div className="d-flex w-100 ">
                    {hasChildren ?
                        <button className="btn p-0 m-0 shadow-none" onClick={toggleShowChild} >
                            {showChild ?
                                <img src={downArrow} height={20} alt="" />
                                :
                                <img src={rightArrow} height={20} alt="" />
                            }
                        </button>
                        : <div className="" style={{ marginLeft: "21px" }} />
                    }
                    <div className="w-100 btn d-flex text-white p-0 mx-1  border-0 "
                        onClick={selecteElement}
                        onMouseEnter={() => handleHover(true)}
                        onMouseLeave={() => handleHover(false)}
                    >
                        {value.tagName}
                    </div>
                </div>
                <div className=" dropdown ">
                    <button className="btn p-0 mx-1"

                        data-toggle="dropdown"
                    >
                        <img className=" h-75 " src={threeDots} alt="" />
                    </button>
                    <div className="dropdown-menu p-0 my-1 " aria-labelledby="dropdownMenuButton">

                        <div className="dropdown-item my-1  " onClick={addChild} >
                            Add Child
                        </div>
                        <div className="dropdown-item my-1  " onClick={addText} >
                            Add Text
                        </div>
                        <div className="dropdown-item my-1  " onClick={moveUp} >
                            Move Up
                        </div>
                        <div className="dropdown-item my-1  " onClick={moveDown}>
                            Move Down
                        </div>

                        <div className="dropdown-item my-1 bg-danger " onClick={removeElem} >
                            Remove
                        </div>

                    </div>
                </div>
            </div>
            {
                hasChildren && showChild ?
                    <div className="col ms-2 m-0  border-start border-1 border-black ">
                        {value.children.map((child, index) =>
                            <HtmlTree component={component} key={index} Val={child} className="row" changeParent={(Val, offest = 0, importComp = null) => updateChild(index, Val, offest, importComp)} />)
                        }
                    </div> :
                    null
            }
        </Fragment>
    )
}