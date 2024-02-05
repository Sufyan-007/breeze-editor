import { useState } from "react"
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
export default function Variables({ comp, ...props }) {
    const [showVariables, setShowVariables] = useState(false)

    return (
        <div {...props}>
            <div className="d-flex ">
                <button className="btn  p-0 m-0  shadow-none" onClick={() => setShowVariables((state) => !state)}>
                    {showVariables ?
                        <img src={downArrow} height={24} alt="" />
                        :
                        <img src={rightArrow} height={24} alt="" />
                    }
                </button >
                State Variables
            </div>
            {showVariables ?
                <div className="col">

                    {Object.entries(comp.stateVars).map(([index, variable]) =>
                        <div className=" my-1 ms-3 w-75 bg-light card">
                            {variable.name}
                        </div>
                    )}
                    <button className="btn btn-secondary row w-50 btn-sm m-1 ms-4">
                        Add Variable
                    </button>
                </div>
                : null
            }
        </div>
    )
}