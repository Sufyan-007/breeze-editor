import { addHtmlChild } from "./HtmlConfigService";

export class MessageListenerService {
    selectedElement = null;
    constructor(projectName,componentName){
        console.log("Initializing MessageListenerService")
        this.projectName = projectName;
        this.componentName = componentName;
    }

    onElementDrop(element){
        console.log("onElementDrop", element);
        if (this.selectedElement){
            console.log(this.selectedElement)
            console.log(element.target)
            console.log({elementType:"HTML",component:this.selectedElement})
            addHtmlChild(this.projectName, element.target,this.componentName,{elementType:"HTML",component:this.selectedElement}).then(()=>{
                console.log("Added element")
            })
        }
    }
    setSelectedElement(elem){
        this.selectedElement = elem;
    }
}
