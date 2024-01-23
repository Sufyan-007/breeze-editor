import { useContext, useState } from "react";
import Html from "./Html";

import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { ServiceContext } from "../store/Context";
import Variables from "./Variables";
import Functions from "./Functions";

export default function RootComponent({ name, component, ...props }) {
    
    const [Component, setComponent] = useState(component)
    const { configService } = useContext(ServiceContext)
    const [showHtml, setShowHtml] = useState(false)
    const [showVariables, setShowVariables] = useState(false)
    const [showFunctions, setShowFunctions] = useState(false)

    function toggleHtml() {
        setShowHtml((state) => !state)
    }
    function toggleVariables() {
        setShowVariables((state) => !state)
    }
    function toggleFunctions() {
        setShowFunctions((state) => !state)
    }


    function updateComponent() {
        configService.updateComponent(Component)
    }


    function updateHtml(html) {
        if (html) {
            setComponent((component) => {
                const comp = { ...component, html: html }
                configService.updateComponent(comp)
                return comp
            })
            console.log("updateHtml")
        }
    }


    return (
        <div {...props}>
            <div className="container-fluid border border-dark-subtle border-2">
                <div className=" d-flex justify-content-between mt-3 fw-bold">
                    <div>{name}</div>
                    <button className="btn btn-secondary btn-sm " onClick={updateComponent}>Update</button>
                </div>

                <div className="row">
                    <div className="d-flex ">
                        <button className="btn  p-0 m-0  shadow-none" onClick={toggleHtml}>
                            {showHtml ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        HTML
                    </div>
                    {showHtml ? <div className="col  ">
                        <Html Val={Component.html} className="row mx-1 " changeParent={(val) => updateHtml(val)} />
                    </div> : null}
                </div>
                <div className="row">
                    <div className="d-flex ">
                        <button className="btn  p-0 m-0  shadow-none" onClick={toggleVariables}>
                            {showVariables ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        State Variables
                    </div>
                    {showVariables?
                        <div className="col">
                            {Object.entries(component.stateVars).map(([index,variable]) =><Variables className="row m-1 " key={variable['$id']} variable={variable} />)}
                            <button className="btn btn-secondary row w-50 btn-sm m-1 ms-4">
                                Add Variables
                            </button>
                        </div>
                    :null}
                </div>
                <div className="row">
                    <div className="d-flex ">
                        <button className="btn  p-0 m-0  shadow-none" onClick={toggleFunctions}>
                            {showFunctions ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Functions
                    </div>
                    {showFunctions?
                        <div className="col">
                            {Object.entries(component.functions).map(([index,func]) =><Functions className="row m-1 " key={func['$id']} func={func} />)}
                            <button className="btn btn-secondary row w-50 btn-sm m-1 ms-4">
                                Add Function
                            </button>
                        </div>
                    :null}
                </div>
            </div>
        </div>
    )
}