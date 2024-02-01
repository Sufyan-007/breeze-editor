import arrowReturn from "../assets/icons/arrow-return-left.svg"
import {Form } from "react-bootstrap"
import Html from "./Html"
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { useState } from "react"

export default function DetailedHtml(params) {
    const { elem, popSelection, pushSelection, ...props } = params
    const [showHtml, setShowHtml] = useState(false)
    
    function toggleHtml(){
        setShowHtml(state=>!state)
    }

    return (
        <div {...props}>
            <div className="container-fluid">
                <div className="d-flex m-1 mb-4 fw-bold fs-4">
                    <button className=" d-flex my-2 p-0  btn" onClick={popSelection}>
                        <img src={arrowReturn} className="me-2" style={{ height: '1rem' }} alt="" />
                    </button>
                    {elem.attributes?.id?.value}
                </div>
                <Form >
                    <Form.Group className="my-3">
                        <Form.Label className="my-0 fw-medium">
                            Tag Name
                        </Form.Label>
                        <Form.Control value={elem.tagName} />
                    </Form.Group>
                    <Form.Group className="my-3">
                        <Form.Label className="my-0 fw-medium">
                            Id
                        </Form.Label>
                        <Form.Control value={elem.attributes?.id?.value} />
                    </Form.Group>
                    <Form.Group className="my-3">
                        <Form.Label className="my-0 fw-medium">
                            ClassName
                        </Form.Label>
                        <Form.Control value={elem.attributes?.className?.value} />
                    </Form.Group>
                    
                </Form>

                <div className="row py-2 border-black border-top border-bottom">
                    <div className="d-flex fs-5  ">
                        <button className="btn  p-0 m-0  shadow-none" onClick={toggleHtml}>
                            {showHtml ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Children Tree
                    </div>
                    {showHtml ? <div className="col  ">
                        <Html Val={elem} className="row mx-1 "  changeParent={(val) => console.log(val)} />
                    </div> : null}
                </div>
            </div>
        </div>
    )
}