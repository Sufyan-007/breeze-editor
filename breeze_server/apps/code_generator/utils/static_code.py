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
                const [MyComponent, setMyComponent] = useState(() => {
                    const DefaultComponent = () => <div>Preview</div>;
                    DefaultComponent.displayName = "DefaultComponent";
                    return DefaultComponent;
                });
                const [customProps, setCustomProps] = useState({ variant: "warning" });
                const [componentDir, setComponentDir] = useState(""); // Example name for dynamic load
                const [children, setChildren] = useState("My Button");
                const [sandboxStyle, setSandboxStyle] = useState({});
                const [isPreview, setIsPreview] = useState(false);
                const [styles, setStyles] = useState("");
                useEffect(() => {
                    const handleMessage = (event) => {
                    if (event.origin === "http://localhost:3000" || true) {
                        if (event.data.type === "resource") {
                        const resource = event.data.resource;
                        if (resource.type === "component") {
                            setComponentDir(resource.component);
                            setIsPreview(resource.isPreview);
                            setStyles(resource.component.styles);
                            setSandboxStyle(resource.component.sandboxStyle);
                        }
                        if (resource.type === "props") {
                            setCustomProps(resource.props);
                        }
                        }
                    }
                    };
                    window.parent.postMessage(
                    { source: "APP", type: "request", request: { type: "component" } },
                    "*"
                    );
                    window.parent.postMessage(
                    { source: "APP", type: "request", request: { type: "props" } },
                    "*"
                    );

                    window.addEventListener("message", handleMessage);

                    return () => {
                    window.removeEventListener("message", handleMessage);
                    };
                }, []);

                useEffect(() => {
                    const loader = async () => {
                    try {
                        let library = componentDir?.library;
                        console.log(library)
                        if (library === "html") {
                        setMyComponent(() => componentDir.name);
                        return;
                        }
                        if (library === "components") {
                        const path = `./components/${componentDir.name}`;

                        const comp = await import(path);
                        const component =
                            comp.default?.name === componentDir.name
                            ? comp.default
                            : comp[componentDir.name];

                        setMyComponent(() => component);
                        return;
                        }
                        let lib;
                        switch (library) {
                        

                        case "react-bootstrap":
                            lib = await import("react-bootstrap");
                            break;

                       

                        default:
                            console.error("Library not supported");
                            return;
                        }
                        const { [componentDir.name]: Component } = lib;

                        if (Component) {
                        setMyComponent(() => Component);
                        } else {
                        console.error(`Component  not found in `);
                        }
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
                    <div style={sandboxStyle} id="SandBox">
                        <MyComponent {...customProps} style={styles} id="SandBox-1-1">
                        {/* {children} */}breeze
                        </MyComponent>
                    </div>
                    </Fragment>
                );
                };

                export default SandBox;

"""
