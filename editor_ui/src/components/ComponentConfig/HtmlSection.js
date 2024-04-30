import {  useContext, useRef, useState } from "react"
import HtmlTree from "../HtmlTree/HtmlTree"
import ElementConfigSidebar from "./ElementConfigSidebar"
import { ComponentContext } from "./ComponentConfigPage"

export default function HtmlSection() {
    const {componentName,componentConfig} = useContext(ComponentContext)
    const [iframeSrc, setIframeSrc] = useState("http://localhost:" + componentConfig.port)
    const srcInput = useRef(iframeSrc)
    const [selected,setSelected] = useState(0)
    
    
    

    return (
        <div className="row flex-grow-1" style={{ height: "35rem"}}>
            <div className="text-white col-3 h-100" style={{ width: "18rem", backgroundColor: "#303033" }}>
                <div className="row">
                    <div
                        className="py-2 btn rounded-0 text-white  w-50 "
                        style={selected === 0 ? { backgroundColor: "#303033" } : {backgroundColor:"rgb(33, 37, 41) "}}
                        onClick={()=>setSelected(0)}
                    >
                        Html Tree
                    </div>
                    <div
                        className="py-2 btn rounded-0 text-white  w-50 "
                        style={selected=== 1? { backgroundColor: "#303033" } : {backgroundColor:"rgb(33, 37, 41) "}}
                        onClick={()=>setSelected(1)}
                    >
                        Add Element
                    </div>
                </div>
                {selected===0?
                    <HtmlTree htmlId={componentName} config={componentConfig} className="row "  />
                    :
                    <div className="row">
                        Add Element
                    </div>
                }
            </div>
            <div className="col overflow-hidden p-0">
                <div className=" bg-dark-subtle align-items-center d-flex" style={{ 'height': "1.25rem" }}>
                    <input ref={srcInput} defaultValue={iframeSrc} type="text " className=" mx-2 " style={{ height: "1rem" }} onKeyDown={e => { if (e.key === "Enter") setIframeSrc(e.target.value) }} />
                </div>
                <iframe src={iframeSrc} title="Generated Project" style={{ 'transform': 'scale(0.8)', 'width': '125%', 'height': '125%', 'transformOrigin': '0 0' }} ></iframe>
            </div>
            <ElementConfigSidebar/>
        </div>
    )
}