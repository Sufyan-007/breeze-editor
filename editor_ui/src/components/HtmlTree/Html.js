

import rightArrow from "../../assets/icons/arrow_right_icon.svg"
import downArrow from "../../assets/icons/arrow_down_icon.svg"
import threeDots from "../../assets/icons/three_dots_icon.svg"
import HtmlTree from "./HtmlTree"
import { Fragment, useState } from "react"

export default function Html({value,config}) {
    const [showChild, setShowChild] = useState(false)
    const hasChildren = value.children?.length > 0

    console.log(value)

    function toggleShowChild(){
        setShowChild(state=>!state)
    }

    return (
        <Fragment>
            <div className=" p-0 d-flex justify-content-between "  >
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
            
                    >
                        {value.tagName}
                    </div>
                </div>
            </div>
            {
                hasChildren && showChild ?
                    <div className="col ms-2 m-0  border-start border-1 border-black ">
                        {value.children.map((child, index) =>
                            <HtmlTree htmlId={child["_id"]} config={config} className="row" />
                        )
                        }
                    </div> :
                    null
            }
        </Fragment>
    )
}