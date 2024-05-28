import { useContext, useEffect, useRef, useState } from "react"
import HtmlTree from "../HtmlTree/HtmlTree"
import ElementConfigSidebar from "./ElementConfigSidebar"
import { ComponentContext } from "./ComponentConfigPage"

export default function HtmlSection() {
    const { componentName, componentConfig } = useContext(ComponentContext)
    const [iframeSrc, setIframeSrc] = useState("http://localhost:" + componentConfig.port)
    const srcInput = useRef(iframeSrc)
    const [selected, setSelected] = useState(0)
    const iFrameRef = useRef();


    const setIframeSource = () => {
        const newValue = srcInput.current.value;
        setIframeSrc(newValue);
    };

    useEffect(() => {

        window.addEventListener("message", (message) => {
            if(message.data.source==="APP"){
                console.log(message.data)
            }
        })
        setTimeout(async () => {
            const iframe = document.getElementById("iFrame")

            if (iframe) {
                iframe.contentWindow.postMessage({ func: '()=>{console.log(" Hello World") }' }, "*")
            }
        }, 500)
    }, [])


    return (
        <div className="row flex-grow-1" style={{ position: "relative" }}>

            <div className="text-white col-3 h-100" style={{ width: "18rem", backgroundColor: "#303033" }}>
                <div className="row">
                    <div
                        className="py-2 btn rounded-0 text-white  w-50 "
                        style={selected === 0 ? { backgroundColor: "#303033" } : { backgroundColor: "rgb(33, 37, 41) " }}
                        onClick={() => setSelected(0)}
                    >
                        Html Tree
                    </div>
                    <div
                        className="py-2 btn rounded-0 text-white  w-50 "
                        style={selected === 1 ? { backgroundColor: "#303033" } : { backgroundColor: "rgb(33, 37, 41) " }}
                        onClick={() => setSelected(1)}
                    >
                        Add Element
                    </div>
                </div>
                {selected === 0 ?
                    <HtmlTree htmlId={componentName} config={componentConfig} className="row my-1" />
                    :
                    <div className="row">
                        Add Element
                    </div>
                }
            </div>
            <div className="col overflow-hidden p-0">
                <div className=" bg-dark-subtle align-items-center d-flex justify-content-start" style={{ 'height': "2.4rem" }}>

                    <div className="me-3">
                        <input
                            type="text"
                            ref={srcInput}
                            defaultValue={iframeSrc}
                            id="Form_Search"
                            role="searchbox"
                            className="InputBox me-2 rounded"
                        />
                        <input type="submit" id="Form_Go" className="Button bg-primary text-light rounded" value="GO" onClick={setIframeSource} />
                    </div>
                </div>
                <iframe ref={iFrameRef} id="iFrame" src={iframeSrc} title="Generated Project" style={{ 'transform': 'scale(0.8)', 'width': '125%', 'height': '125%', 'transformOrigin': '0 0' }} ></iframe>
            </div>
            <ElementConfigSidebar />
        </div>
    )
}