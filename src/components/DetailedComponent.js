import HtmlTree from "./HtmlTree";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { ServiceContext } from "../store/Context";
import Functions from "./Functions";
import arrowReturn from "../assets/icons/arrow-return-left.svg";
import StateVariables from "./StateVariables";
import { router } from "../App";
import Hooks from "./Hooks";
import PropVariables from "./PropVariables";
import OtherVariables from "./OtherVariables";
import Imports from "./Imports";
import Wrapper from "./Wrapper";


export default function DetailedComponent({ ...props }) {

    const { projectName, componentName } = useParams()
    const config = useSelector((state) => state.config)
    const component = config[componentName]

    const name = componentName
    const [comp, setComponent] = useState(component)
    const [showHtml, setShowHtml] = useState(false)
    const { configService } = useContext(ServiceContext)
    useEffect(() => { setComponent(component) }, [component])
    if (!component || !comp) {
        return null
    }

    function toggleHtml() {
        setShowHtml((state) => !state)
    }


    function updateStateVariables(stateVars) {
        setComponent((component) => {
            const comp = { ...component, stateVars }
            configService.updateComponent(comp)
            return comp
        })
    }

    function updatePropVariables(propsVars) {
        setComponent((component) => {
            const comp = { ...component, propsVars }
            configService.updateComponent(comp)
            return comp
        })
    }

    function updateHooks(hooks){
        // console.log("update hooks")
        // console.log(hooks)
        setComponent((component) => {
            const comp = { ...component, hooks }
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

    function updateFunctions(functions) {
        setComponent((component) => {
            const comp = { ...component, functions }
            configService.updateComponent(comp)
            return comp
        })
    }

    function updateOtherVars(otherVars) {
        setComponent((component) => {
            const comp = { ...component, otherVars }
            configService.updateComponent(comp)
            return comp
        })
    }

    function updateImports(imports){
        setComponent((component) => {
            const comp = { ...component,imports}
            configService.updateComponent(comp)
            return comp
        })
    }

    function updateWrapper(wrapper_store){
        setComponent((component) => {
            const comp = { ...component,wrapper_store}
            configService.updateComponent(comp)
            return comp
        })
    }

    function goHome() {
        router.navigate("/editor/" + projectName)
    }

    return (
        <div {...props}>
            <div className="container-fluid">
                <div className="d-flex m-1 fw-bold fs-5">
                    <button className=" d-flex my-2 p-0  btn" onClick={goHome}>
                        <img src={arrowReturn} className="me-2" style={{ height: '1rem' }} alt="" />
                    </button>
                    {name}
                </div>


                <Imports imports={comp.imports} updateImports={updateImports} className="row mt-3 border-top py-2 fs-6 border-black border-bottom" />

                <PropVariables propVars={comp.propsVars} updatePropVars={updatePropVariables} className="row  py-2 fs-6 border-black border-bottom"/>

                <StateVariables stateVars={comp.stateVars} updateStateVariables={updateStateVariables} className="row  py-2 fs-6 border-black border-bottom" />

                <OtherVariables otherVars={comp.otherVars} updateOtherVars={updateOtherVars} className="row  py-2 fs-6 border-black border-bottom" />

                <Functions functions={comp.functions} updateFunctions={updateFunctions} className="row py-2 fs-6 border-black border-bottom" />

                <Hooks comp={comp} updateHooks={updateHooks} className="row  py-2 fs-6 border-black border-bottom" />

                <Wrapper comp={comp} updateWrapper={updateWrapper} className="row py-2 fs-6 border-black border-bottom" />
                    


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
                        <HtmlTree Val={comp.html} component={comp} className="row mx-1 " changeParent={(val,offeset=0, importComp = null) => updateHtml(val, importComp)} />
                    </div> : null}
                </div>
            </div>
        </div>
    )
}