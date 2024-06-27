import { Fragment, useContext } from "react"
import { removeHtmlElem } from "../../services/HtmlConfigService"
import { useParams } from "react-router";
import { ComponentContext } from "../ComponentConfig/ComponentConfigPage";
import threeDots from "../../assets/icons/three_dots_icon.svg"

export default function Conditional({ value, htmlId, selectElem, reference }) {

    const { setComponentConfig } = useContext(ComponentContext)
    const { projectName, componentName } = useParams();
    console.log("cdkjfdkf", value)
    function removeElem() {
        removeHtmlElem(projectName, componentName, htmlId).then((res) => {
            setComponentConfig(res)
        })
    }
    return (
        <Fragment>
            <div className="p-0 d-flex" ref={reference} onClick={selectElem} >
                <div className=" ms-3" />
                <div className="w-100  d-flex justify-content-between flex-row">
                    <div className="w-100 btn d-flex text-white p-0 mx-1  border-0 "

                    >
                        Conditional
                    </div>

                </div>
                <div className=" dropdown ">
                    <button className="btn p-0 mx-1"

                        data-toggle="dropdown"
                    >
                        <img className=" h-75 " src={threeDots} alt="" />
                    </button>
                    <div className="dropdown-menu p-0 my-1 " aria-labelledby="dropdownMenuButton">

                        <div className="dropdown-item my-1 bg-danger " onClick={removeElem} >
                            Remove
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>

    )
}