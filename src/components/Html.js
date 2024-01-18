import { useState } from "react"
import rightArrow from "../assests/icons/arrow_right_icon.svg"
import downArrow from "../assests/icons/arrow_down_icon.svg"
import threeDots from "../assests/icons/three_dots_icon.svg"
import { Modal, Button, Form } from "react-bootstrap"

export default function Html({ Val,changeParent ,...props }) {

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

    function updateValue(key,val) {
        
        setValue((value) => {
            return {...value, [key]:val}
        })
    }

    function updateAttribute(key,val) {
        const res={ type: "LITERAL", value: val}
        const attributes={...value.attributes,[key]:res}
        setValue(value=>{
            const newVal={...value,attributes}
            return newVal
        })

    }

    function updateChild(key,child) {
        const children = [...value.children]
        children[key]=child
        setValue(value=>{
            const newVal= {...value,children}
            changeParent(newVal)
            return newVal   //
        })
        
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
                                <Form.Control placeholder="name" value={value.tagName} onChange={(event) => {updateValue("tagName",event.target.value) }} />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>
                                    ClassName
                                </Form.Label>
                                <Form.Control placeholder="className" value={value.attributes.className?.value} onChange={(event) => {updateAttribute("className",event.target.value) }} />
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
                        <div className="mx-1" />
                    }
                    <div className="w-100 card d-flex justify-content-between flex-row">
                        <div>{value.tagName}</div>
                        <button className="btn p-0 mx-1" onClick={openModal}>
                            <img className=" h-75 " src={threeDots} alt="" />
                        </button>
                    </div>
                </div>
                {hasChildren && showChild ?
                    <div className="col ms-2 m-0 border-2 border-start border-1 border-black ">
                        {value.children.map((child,index) => <Html key={index} Val={child} className="row" changeParent={(Val)=>updateChild(index,Val)} />)}
                    </div> :
                    null
                }
            </div>
        )
    }
    else {
        return (
            <div {...props}>
                <div >text</div>
            </div>
        )
    }
}