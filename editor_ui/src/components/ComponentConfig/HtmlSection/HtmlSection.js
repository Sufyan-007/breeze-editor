import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import HtmlTree from "./HtmlTree/HtmlTree"
import ElementConfigSidebar from "./ElementConfigSidebar"
import { ComponentContext } from "../ComponentConfigPage"
import { MessageListenerService } from "../../../services/MessageListenerService"
import { useParams } from "react-router"
import AddElements from "./AddElements"
import ActionsConfig from "../ConfigSection/ActionsConfig"
import { useWindowDimension } from '../../../hooks/useWindowDimension'

export const DragContext = createContext({
  messageListener: null,
});

export const TestPropsContext = createContext({});

export default function HtmlSection() {
  const { componentConfig } = useContext(ComponentContext);
  const [iframeSrc, setIframeSrc] = useState(
    `${process.env.REACT_APP_GENERATED_PROJECT_DOMAIN}:` + componentConfig.port
  );
  const srcInput = useRef();
  const [selected, setSelected] = useState(0);
  const iFrameRef = useRef();
  const { projectName, componentName } = useParams();
  const messageListener = useMemo(() => {
    return new MessageListenerService(projectName, componentName);
  }, [projectName, componentName]);

  const [testProps, setTestProps] = useState({ prop1: "xyz" });

  const setIframeSource = () => {
    const newValue = srcInput.current.value;
    setIframeSrc(newValue);
  };

  const [windowWidth, windowHeight] = useWindowDimension();

  useEffect(() => {
    const handler = (message) => {
      if (message.data.source === "APP") {
        if (message.data.type === "request") {
          console.log("got request", message.data);
          if (message.data.request.type === "props") {
            const iframe = document.getElementById("iFrame");
            iframe.contentWindow.postMessage(
              {
                type: "resource",
                resource: { type: "props", props: testProps },
              },
              "*"
            );
          }
        }
      }
    };
    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, [testProps]);

  useEffect(() => {
    const handler = (message) => {
      if (message.data.source === "APP") {
        console.log(message.data);
        if (message.data.type === "elementDrop") {
          messageListener.onElementDrop(message.data);
        }
        if (message.data.type === "request") {
          const request = message.data.request;
          if (request.type === "component") {
            const iframe = document.getElementById("iFrame");
            iframe.contentWindow.postMessage(
              {
                type: "resource",
                resource: { type: "component", component: componentConfig },
              },
              "*"
            );
          }
        }
      }
    };
    window.addEventListener("message", handler);
    setTimeout(async () => {
      const iframe = document.getElementById("iFrame");

      if (iframe) {
        iframe.contentWindow.postMessage(
          { func: '()=>{console.log(" Hello World") }' },
          "*"
        );
      }
    }, 500);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, [messageListener, componentConfig]);

  return (
    <TestPropsContext.Provider value={{ testProps, setTestProps }}>
      <DragContext.Provider value={{ messageListener }}>
        <div className="row flex-grow-1" style={{ position: "relative" }}>
          <div
            className="text-white  d-flex flex-column col-3 h-100"
            style={{ width: "18rem", backgroundColor: "#303033" }}
          >
            <div className="row p-2">
              <div className="border border-dark px-0">
                <div
                  className="py-2 btn rounded-0 text-white col-6 border-right border-dark"
                  style={
                    selected === 0
                      ? { backgroundColor: "rgb(33, 37, 41) " }
                      : { backgroundColor: "#303033" }
                  }
                  onClick={() => setSelected(0)}
                >
                  Html
                </div>
                <div
                  className="py-2 btn rounded-0 text-white col-6 border-left border-dark"
                  style={
                    selected === 1
                      ? { backgroundColor: "rgb(33, 37, 41) " }
                      : { backgroundColor: "#303033" }
                  }
                  onClick={() => setSelected(1)}
                >
                  Config
                </div>
              </div>
            </div>
            {selected === 0 && windowWidth ? (
              <>
                <div className="row">
                  <div className=" d-flex" style={{ overflowY: 'auto', height: `${(windowHeight - 154) / 2}px` }}>
                    <div className="col" style={{}}>
                      <HtmlTree
                        htmlId={componentName}
                        config={componentConfig}
                        className="row my-1"

                      />
                    </div>
                  </div>
                  <div className=" d-flex border-top border-3 border-black" style={{ height: `${(windowHeight - 74) / 2}px` }}>
                    <div className="col">
                      <div className="m-1 h-75" >
                        <AddElements />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <ActionsConfig />
              </div>
            )}
          </div>
          <div className="col overflow-hidden p-0">
            <div
              className=" bg-dark-subtle align-items-center d-flex justify-content-start"
              style={{ height: "2.4rem" }}
            >
              <div className="me-3">
                <input
                  type="text"
                  ref={srcInput}
                  defaultValue={iframeSrc}
                  id="Form_Search"
                  role="searchbox"
                  className="InputBox me-2 rounded"
                />
                <input
                  type="submit"
                  id="Form_Go"
                  className="Button bg-primary text-light rounded"
                  defaultValue="GO"
                  onClick={setIframeSource}
                />
              </div>
            </div>
            <iframe
              ref={iFrameRef}
              id="iFrame"
              src={iframeSrc}
              title="Generated Project"
              style={{
                transform: "scale(0.8)",
                width: "125%",
                height: "125%",
                transformOrigin: "0 0",
              }}
            ></iframe>
          </div>
          <ElementConfigSidebar />
        </div>
      </DragContext.Provider>
    </TestPropsContext.Provider>
  );
}
