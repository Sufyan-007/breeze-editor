
import rightArrow from "../../assets/icons/arrow_right_icon.svg"
import downArrow from "../../assets/icons/arrow_down_icon.svg"
import { useEffect, useState } from "react"
import MonacoEditor from "../common/MonacoEditor"

export default function Function({ func }) {
    console.log(func)
    const [showDetails, setShowDetails] = useState(false)
    const elem =document.getElementById("lets-try-this)")
    console.log(elem)
    useEffect(()=>{
        console.log("Elem has been changed")
    },[elem])
    return (
        <div className={" container-fluid  border p-2 " + (showDetails ? "bg-dark" : "")}>
            <div className="d-flex px-1 " style={{ cursor: 'pointer' }} onClick={() => setShowDetails(state => !state)} >
                <button className="btn p-0 m-0 shadow-none" >
                    {showDetails ?
                        <img src={downArrow} height={20} alt="" />
                        :
                        <img src={rightArrow} height={20} alt="" />
                    }
                </button>
                <div className=" fs-5 ">
                    {func.name}
                </div>

                <div className=" ms-4 mt-1">
                    {func?.description ? func.description : " No description"}
                </div>
            </div>
            {(showDetails||true) &&
                <>
                    <div className="row mx-2 " >
                        Parameters
                    </div>
                    <div className="row mx-2">
                        Function Body
                    </div>
                    <div id="lets-try-this" className="row m-3">
                        {/* <MonacoEditor
                            defaultValue=""
                            id={func['$id']}
                            width="90%"
                        /> */}
                    </div>
                </>

            }
        </div>
    )
}