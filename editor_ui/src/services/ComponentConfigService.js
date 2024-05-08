export async function addComponent(name, type, route) {

    const response = await (await fetch("http://localhost:8000/editor/add-component/" + this.projectName + "/",
        { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name , type }) }
    )).json()
    if (route) {
         await this.addRoute(route, response.comp)
    }
    return response
}