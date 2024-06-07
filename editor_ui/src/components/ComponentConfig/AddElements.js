import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getComponents } from "../../services/ComponentReadService";
import { DragableElements } from "./DragableElements";

export default function AddElements(){
    const [components, setComponents] = useState({});
    const { projectName } = useParams()
    console.log(components)


    useEffect(() => {
        const load = async () => {
            const resp = await getComponents(projectName)
            setComponents(resp)
        }
        load()
    }, [projectName])
    return (
        <div className="row">
            <div className="col">
                {components.HTML?.slice(0,10).map(elem=>
                    <DragableElements elem={elem} />
                )

                }

                
            </div>
        </div>
    )
}