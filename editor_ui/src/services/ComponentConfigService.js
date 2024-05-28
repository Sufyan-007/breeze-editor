export async function addComponent(name, type, route,projectName) {

    const response = await (await fetch("http://localhost:8000/editor/add-component/" + projectName + "/",
        { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name , type }) }
    )).json()
    if (route) {
        console.log("Hello there!")
         await addRoute(route, response.comp,projectName)
    }
    return response
}
export async function  addRoute(route, component,projectName,redirectTo=null,) {
    console.log(route, component, redirectTo)
    if (route && (component||redirectTo) ) {
        const response = await (await fetch("http://localhost:8000/editor/add-route/" + projectName + "/",
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ route,component,redirectTo }) }
        )).json()
        console.log(response)
    }

}