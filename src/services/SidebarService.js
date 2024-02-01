import { BehaviorSubject, Subject } from "rxjs"
class SidebarService{
    constructor(){
        this.selectedElemSub= new BehaviorSubject(null)
    }
    getSelectedElem(){
        return this.selectedElemSub
    }
    setSelectedElem(elem,updateSub=new Subject()){

        this.selectedElemSub.next({elem,updateSub})
        return updateSub
    }
}

export default SidebarService