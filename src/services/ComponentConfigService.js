import { setConfig,setComponent} from '../reducers/ConfigReducer'


class ComponentConfigService{
    constructor(componentName,dispatch){
        this.componentName = componentName;
        this.dispatch = dispatch;
        this.getConfig()
        
    }

    async getConfig(){
        const config= await (await fetch("http://localhost:8000/breeze/read-config/"+this.componentName)).json()
        this.dispatch(setConfig(config))
    }

    setComponent(component){
        this.dispatch(setComponent(component))
    }
}

export default ComponentConfigService