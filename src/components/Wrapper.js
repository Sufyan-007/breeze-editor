
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { Form } from "react-bootstrap"
import { useState } from "react"
export default function Wrapper({ comp, updateWrapper, ...props }) {
    const [showWrapper, setShowWrapper] = useState(false)
    console.log(comp.wrapper_store)
    return (
        <div {...props}>
            <div className="d-flex ">
                <button className="btn  p-0 m-0  shadow-none" onClick={() => setShowWrapper((state) => !state)}>
                    {showWrapper ?
                        <img src={downArrow} height={24} alt="" />
                        :
                        <img src={rightArrow} height={24} alt="" />
                    }
                </button>
                Wrapper
            </div>
            {showWrapper ?
                <div className="col">
                    <Form.Select  className="m-1 p-1 w-75">
                        <option value={comp.wrapper_store} selected hidden>{comp.wrapper_store}</option>
                        <option value="">No Wrapper</option>
                    </Form.Select>
                </div>
                : null
            }
        </div>
    )
}