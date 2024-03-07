import threeDots from "../assets/icons/three_dots_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import { Fragment, useState } from "react"
import HtmlTree from "./HtmlTree"

export default function Expression({ value, selecteElement, config, reference, component, setValue, changeParent }) {
    const exp = value.children[0]
    const [showChild, setShowChild] = useState(false)
    const isCode = exp.type === "code"
    const isMap = exp.type === "map"
    const isCond = exp.type === "condition"

    function toggleShowChild() {
        setShowChild((showChild) => !showChild)
    }

    function updateChild(key, Val, importComp) {
        if (Val) {
            const e = { ...exp, [key]: Val }
            setValue((value) => {
                const val = { ...value, children: [e] }
                changeParent(val)
                return val
            })
        }
    }

    return (
        <Fragment>
            <div ref={reference} className="p-0 d-flex" >
                <div className="w-100  d-flex justify-content-between flex-row">
                    {!isCode ?
                        <button className="btn p-0 m-0 shadow-none" onClick={() => toggleShowChild()} >
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
                    >
                        Expression : {exp.type.slice(0, 4)}
                    </div>
                    <div className=" dropdown ">
                        <button className="btn p-0 mx-1"
                            data-toggle="dropdown"
                        >
                            <img className=" h-75 " src={threeDots} alt="" />
                        </button>
                        <div className="dropdown-menu p-0 my-1 " aria-labelledby="dropdownMenuButton">
                            <div className="dropdown-item my-1  " onClick={() => { changeParent(value, -1) }}>
                                Move Up
                            </div>
                            <div className="dropdown-item my-1  " onClick={() => { changeParent(value, 1) }} >
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
                isMap && showChild ?
                    <div className="col ms-2 m-0  border-start border-1 border-black ">
                        {exp.children.map((child, index) =>
                            <HtmlTree component={component} key={index} Val={child} className="row" changeParent={(Val, offest = 0, importComp = null) => updateChild("children", [Val], importComp)} />)
                        }
                    </div> :
                    null
            }
            {
                isCond && showChild ?
                    <div className="col ms-2 m-0  border-start border-1 border-black ">
                        <div >
                            True Case:
                        </div>
                        <HtmlTree component={component} key={exp.trueCase.attributes?.id.value ?? exp.trueCase.id} Val={exp.trueCase} className="row" changeParent={(Val, offest = 0, importComp = null) => updateChild("trueCase", Val, importComp)} />
                        <div >
                            False Case:
                        </div>
                        <HtmlTree component={component} key={exp.falseCase.attributes?.id.value} Val={exp.falseCase} className="row " changeParent={(Val, offest = 0, importComp = null) => updateChild("falseCase", Val, importComp)} />

                    </div> :
                    null
            }
        </Fragment>
    )
}