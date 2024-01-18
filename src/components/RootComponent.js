import Html from "./Html";

export default function RootComponent({name,component,...props}){
    return (
        <div {...props}>
            <div>{name}</div>
            <div className="col border border-2 ">    
                <Html value={component.html} className="row mx-1" />
            </div>
        </div>
    )
}