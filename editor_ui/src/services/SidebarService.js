import { BehaviorSubject, Subject } from "rxjs"
class SidebarService{
    constructor(){
        this.selectedElemSub= new BehaviorSubject(null)
    }
    getSelectedElem(){
        return this.selectedElemSub
    }
    setSelectedElem(elem,component){
        const updateSub=new Subject()
        this.selectedElemSub.next({elem,component,updateSub})
        return updateSub
    }
}

export default SidebarService