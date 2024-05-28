export async function updateFunction(project_id,component,function_config){
    const response = await (await fetch("http://localhost:8000/editor/update-function-config/",
        {
            method: "PUT", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({project_id,component,function_config})
        }
    )).json()
    return response
}

export async function addFunction(project_id,component,function_config){
    const response = await (await fetch("http://localhost:8000/editor/update-function-config/",
        {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({project_id,component,function_config})
        }
    )).json()
    return response
}
