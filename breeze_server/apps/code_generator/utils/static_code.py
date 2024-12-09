Root_App_Code = f'''
    import React, {{useEffect}} from 'react';
    import router from "./Routing.jsx";
    import {{ RouterProvider }} from "react-router-dom";

    function App() {{
            
        useEffect(() => {{
            const style = document.createElement("style");
            const cssClass =
            ".custom-highlight {{background-color: yellow;outline: red solid 3px ;}}";
            style.appendChild(document.createTextNode(cssClass));
            document.head.appendChild(style);
            const handleMessage = (event) => {{
            
            if (event.origin === "http://localhost:3000") {{
                console.log(event.data)
                if (event.data.func){{
                var fn;
                const functionString ="fn = " + event.data.func
                eval(functionString)
                fn()
                }}
            }}
            }};
            window.addEventListener("message", handleMessage);
            return () => {{
            window.removeEventListener("message", handleMessage);
            }};
        }}, []);
        return (
        <div>
            <RouterProvider router={{router}} />
        </div>
        );
    }}
    
    export default App;
    '''
    
SANDBOX_CODE = """
    import React, { useState, useEffect, Fragment } from "react";
    const SandBox = () => {
        const [MyComponent, setMyComponent] = useState(() => () => <div>Sandbox</div>);
        const [inputVal, setInputVal] = useState("");
        const [componentDir, setComponentDir] = useState("");
        const [customProps, setCustomProps] = useState({});

        useEffect(() => {
            const handleMessage = (event) => {
                if (event.origin === "http://localhost:3000" || true) {
                    if (event.data.type === "resource") {
                        const resource = event.data.resource;
                        if (resource.type === "component") {
                            setComponentDir(resource.component.containingFile);
                        }
                        if (resource.type === "props") {
                            setCustomProps(resource.props);
                        }
                    }
                }
            };
            window.parent.postMessage(
                { source: "APP", type: "request", request: { type: "component" } },
                "*",
            );
            window.parent.postMessage(
                { source: "APP", type: "request", request: { type: "props" } },
                "*",
            );

            window.addEventListener("message", handleMessage);

            return () => {
                window.removeEventListener("message", handleMessage);
            };
        }, []);

        useEffect(() => {
            const loader = async () => {
                try {
                    const comp = await import(`/${componentDir}`);
                    setMyComponent(() => comp.default || comp);
                    console.log(comp)
                } catch (error) {
                    console.error("Failed to load component:", error);
                }
            };

            if (componentDir) {
                loader();
            }
        }, [componentDir]);

        return (
            <Fragment>
                <div className="container-fluid" id="SandBox">
                    
                    <MyComponent {...customProps} id="SandBox-1-1" />

                </div>
            </Fragment>
        );
    };

    export default SandBox;

"""
