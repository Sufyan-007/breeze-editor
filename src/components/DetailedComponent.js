import Html from "./Html";
import { useContext, useState } from "react";
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { ServiceContext } from "../store/Context";
import Functions from "./Functions";
import arrowReturn from "../assets/icons/arrow-return-left.svg";
import StateVariables from "./StateVariables";



export default function DetailedComponent({ component, resetSelection, ...props }) {
    const name = component.name

    const [comp, setComponent] = useState(component)
    const [showHtml, setShowHtml] = useState(false)
    const { configService } = useContext(ServiceContext)

    function toggleHtml() {
        setShowHtml((state) => !state)
    }


    function updateStateVariables(stateVars){
        setComponent((component)=>{
            const comp = {...component,stateVars}
            configService.updateComponent(comp)
            return comp
        })
    }


    function updateHtml(html,importComp) {
        if (html) {
            setComponent((component) => {
                const comp = { ...component,  html }
                if(importComp && !comp.imports.components.includes(importComp)){
                    comp.imports={ ...comp.imports ,components: [...comp.imports.components,importComp]}                       
                }
                configService.updateComponent(comp)
                console.log(comp)
                return comp
            })
            console.log("updateHtml")
        }
    }

    function updateFunctions(functions){
        setComponent((component) => {
            const comp = { ...component,functions }
            configService.updateComponent(comp)
            return comp
        })
    }
    


    return (
        <div {...props}>
            <div className="container-fluid">
                <div className="d-flex m-1 fw-bold fs-5">
                    <button className=" d-flex my-2 p-0  btn" onClick={resetSelection}>
                        <img src={arrowReturn} className="me-2" style={{ height: '1rem' }} alt="" />
                    </button>
                    {name}
                </div>


                <div className="row mt-3 border-top py-2 fs-6 border-black border-bottom">
                    <div className="d-flex ">
                        <button className="btn  p-0 m-0  shadow-none" >
                            {false ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Imports
                    </div>
                </div>

                <div className="row py-2 fs-6 border-black   border-bottom">
                    <div className="d-flex ">
                        <button className="btn  p-0 m-0  shadow-none" >
                            {false ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Prop Variables
                    </div>
                </div>

                <StateVariables stateVars={comp.stateVars} updateStateVariables={updateStateVariables} className="row  py-2 fs-6 border-black border-bottom" />
                    

                <Functions functions={comp.functions} updateFunctions={updateFunctions} className="row py-2 fs-6 border-black border-bottom" />

                <div className="row py-2 fs-6 border-black border-bottom">
                    <div className="d-flex ">
                        <button className="btn  p-0 m-0  shadow-none" >
                            {false ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Hooks
                    </div>
                </div>

                <div className="row py-2 fs-6 border-black border-bottom">
                    <div className="d-flex ">
                        <button className="btn  p-0 m-0  shadow-none" >
                            {false ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Wrapper
                    </div>
                </div>



                <div className="row py-2 border-black border-bottom">
                    <div className="d-flex fs-6  ">
                        <button className="btn  p-0 m-0  shadow-none" onClick={toggleHtml}>
                            {showHtml ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        HTML Tree
                    </div>
                    {showHtml ? <div className="col  ">
                        <Html Val={comp.html} component={comp} className="row mx-1 " changeParent={(val,importComp=null) => updateHtml(val,importComp)} />
                    </div> : null}
                </div>
            </div>
        </div>
    )
}