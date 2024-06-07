import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import HtmlTree from "../HtmlTree/HtmlTree"
import ElementConfigSidebar from "./ElementConfigSidebar"
import { ComponentContext } from "./ComponentConfigPage"
import { MessageListenerService } from "../../services/MessageListenerService"
import { useParams } from "react-router"
import AddElements from "./AddElements"
import ActionsConfig from "./ActionsConfig"

export const DragContext = createContext({
    messageListener: null
})

export default function HtmlSection() {
    const { componentConfig } = useContext(ComponentContext)
    const [iframeSrc, setIframeSrc] = useState("http://localhost:" + componentConfig.port)
    const srcInput = useRef()
    const [selected, setSelected] = useState(0)
    const iFrameRef = useRef();
    const { projectName, componentName } = useParams()
    const messageListener = useMemo(() => {
        return new MessageListenerService(projectName, componentName)
    }, [projectName, componentName])


    const setIframeSource = () => {
        const newValue = srcInput.current.value;
        setIframeSrc(newValue);
    };

    useEffect(() => {

        window.addEventListener("message", (message) => {
            if (message.data.source === "APP") {
                console.log(message.data)
                if (message.data.type === "elementDrop") {
                    messageListener.onElementDrop(message.data)
                }
            }
        })
        setTimeout(async () => {
            const iframe = document.getElementById("iFrame")

            if (iframe) {
                iframe.contentWindow.postMessage({ func: '()=>{console.log(" Hello World") }' }, "*")
            }
        }, 500)
    }, [messageListener])


    return (
        <DragContext.Provider value={{messageListener}} >
            <div className="row flex-grow-1" style={{ position: "relative" }}>

            <div className="text-white col-3 h-100" style={{ width: "18rem", backgroundColor: "#303033" }}>
                <div className="row p-2">
                    <div className="border border-dark px-0">
                        <div
                            className="py-2 btn rounded-0 text-white col-4 border-right border-dark"
                            style={selected === 0 ? { backgroundColor: "rgb(33, 37, 41) " } : { backgroundColor: "#303033" }}
                            onClick={() => setSelected(0)}
                        >
                            Html
                        </div>
                        <div
                            className="py-2 btn rounded-0 text-white col-4 border-dark"
                            style={selected === 1 ? { backgroundColor: "rgb(33, 37, 41) " } : { backgroundColor: "#303033" }}
                            onClick={() => setSelected(1)}
                        >
                            Add El
                        </div>
                        <div
                            className="py-2 btn rounded-0 text-white col-4 border-left border-dark"
                            style={selected === 2 ? { backgroundColor: "rgb(33, 37, 41) " } : { backgroundColor: "#303033" }}
                            onClick={() => setSelected(2)}
                        >
                            Actions
                        </div>
                    </div>
                </div>
                {selected === 0 ?
                    <HtmlTree htmlId={componentName} config={componentConfig} className="row my-1" />
                    :
                    selected===1?
                        <div>Add element</div>
                    :
                    <div>
                        <ActionsConfig />
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
        </DragContext.Provider>
    )
}