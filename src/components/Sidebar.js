import ComponentTree from "./ComponentTree";
import RouterConfig from "./RouterConfig";
import ContextConfig from "./ContextConfig";

export default function Sidebar({ ...props }) {

    return (

        <div {...props}>
            <ComponentTree className="row my-2  border-bottom  border-black" />
            <RouterConfig className="row my-2 border-bottom border-black" />
            <ContextConfig className="row my-2 border-bottom border-black" />

        </div>
    )


}