import { setConfig } from '../reducers/ConfigReducer'
import { setRouterConfig } from '../reducers/RouterConfigReducer';

class ComponentConfigService {
    constructor(projectName, dispatch) {
        this.projectName = projectName;
        this.dispatch = dispatch;
        this.serverURL = "http://localhost:8000";
        this.getComponentConfig();
        this.getRouterConfig();
    }


    async getRouterConfig() {
        const routerConfig = await (await fetch(`${this.serverURL}/editor/read-router-config/` + this.projectName + "/")).json();
        this.dispatch(setRouterConfig(routerConfig))
    }

    async getComponentConfig() {
        const config = await (await fetch(`${this.serverURL}/editor/read-config/` + this.projectName + "/")).json()
        this.dispatch(setConfig(config))
    }

    async updateComponent(data) {
        const config = await (await fetch(`${this.serverURL}/editor/write-config/` + this.projectName + "/",
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }
        )).json()
        console.log(config);
        this.dispatch(setConfig(config))
    }

    async addComponent(name, route) {

        const response = await (await fetch(`${this.serverURL}/editor/add-component/` + this.projectName + "/",
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) }
        )).json()
        this.dispatch(setConfig(response.config))
        if (route) {
            this.addRoute({path : route, component : response.comp})
        }
    }

    async addRoute(routeObj) {
        console.log(routeObj)
        if (routeObj.path && (routeObj.component || routeObj.redirectTo) ) {
            const response = await (await fetch(`${this.serverURL}/editor/add-route/` + this.projectName + "/",
                { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify( routeObj ) }
            )).json()
            console.log(response)
            this.dispatch(setRouterConfig(response))
        }
    }

    async addAllRoutes(allRoutes) {
        console.log(allRoutes);
        const response = await fetch(`${this.serverURL}/editor/add-all-routes/` + this.projectName + "/",
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ allRoutes }) 
        })
        const jsonData = await response.json();
        console.log(response.status);
        console.log(jsonData);
        if (response.status === 200) {
            this.dispatch(setRouterConfig(jsonData));
        }
        return { body: jsonData , status: response.status}
    }

    async addChildRoute(childObj) {
        if (!childObj.path || (!childObj.component && !childObj.redirectTo)) 
            return {body: 'incomplete data provided', status: 400}
        const resPromise = await fetch(`${this.serverURL}/editor/add-child-route/${this.projectName}/`,
            {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(childObj) 
            }
        )

        const response = await resPromise.json()
        if (resPromise.status === 200) {
            this.dispatch(setRouterConfig(response));
        }
        return { body: response , status: resPromise.status}
    }
}

export default ComponentConfigService