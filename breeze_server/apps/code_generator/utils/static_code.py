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