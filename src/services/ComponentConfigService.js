import { setConfig } from '../reducers/ConfigReducer'
import { setRouterConfig } from '../reducers/RouterConfigReducer';

class ComponentConfigService {
    constructor(projectName, dispatch) {
        this.projectName = projectName;
        this.dispatch = dispatch;
        this.getComponentConfig();
        this.getRouterConfig();


    }

    async getRouterConfig() {
        const routerConfig=await (await fetch("http://localhost:8000/editor/read-router-config/" + this.projectName)).json()
        this.dispatch(setRouterConfig(routerConfig))
    }

    async getComponentConfig() {
        const config = await (await fetch("http://localhost:8000/editor/read-config/" + this.projectName)).json()
        this.dispatch(setConfig(config))
    }

    async updateComponent(data) {
        const config = await (await fetch("http://localhost:8000/editor/write-config/" + this.projectName+"/",
            {method: "POST",headers: { 'Content-Type': 'application/json' },body: JSON.stringify(data)}
        )).json()
        console.log(config);
        this.dispatch(setConfig(config))
    }

    async addComponent(name,route){
        
        const response = await (await fetch("http://localhost:8000/editor/add-component/" + this.projectName+"/",
            {method: "POST",headers: { 'Content-Type': 'application/json' },body: JSON.stringify({name,route})}
        )).json()
        this.dispatch(setConfig(response.config))
        this.dispatch(setRouterConfig(response.routes))
    }


}

export default ComponentConfigService