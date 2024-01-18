import Html from "./Html";

export default function RootComponent({name,component,...props}){

    function updateComponent(html){
        console.log(html);
    }
    
    return (
        <div {...props}>
            <div>{name}</div>
            <div className="col border border-2 ">    
                <Html Val={component.html} className="row mx-1" changeParent={(val)=>updateComponent(val)} />
            </div>
        </div>
    )
}