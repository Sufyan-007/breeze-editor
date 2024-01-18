import { useState } from "react"
import rightArrow from "../assests/icons/arrow_right_icon.svg"
import downArrow from "../assests/icons/arrow_down_icon.svg"
import threeDots from "../assests/icons/three_dots_icon.svg"

export default function Html({ value, ...props }) {
    const [showChild, setShowChild] = useState(false)
    const hasChildren = value.children?.length > 0

    function toggleShowChild() {
        setShowChild((showChild) => !showChild)
    }

    if (value.type === 'Element') {
        return (
            <div {...props} >
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
                        <div className="mx-1"/>
                    }
                    <div className="w-100 card d-flex justify-content-between flex-row">
                        <div>{value.tagName}</div>
                        <button className="btn p-0 mx-1">
                            <img className=" h-75 " src={threeDots} alt="" />
                        </button>
                    </div>
                </div>
                {hasChildren && showChild ?
                    <div className="col ms-2 m-0 border-2 border-start border-1 border-black ">
                        {value.children.map(child => <Html value={child} className="row" />)}
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