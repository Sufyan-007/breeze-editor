export async function getComponents(project_id){
    const response = await (await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/config-reader/get-global-components/`,
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({project_id}) }
        )).json()
    return response
}

export async function getHtml(project_id,component,html_id){
    const response = await (await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/get-global-html-config/`,
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({project_id,component,html_id}) }
        )).json()
    return response
}


export async function getStateVars(project_id,component){
    const response = await (await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/config-reader/get-state-vars/` + project_id + "/"+component,
            { method: "GET", headers: { 'Content-Type': 'application/json' } }
        )).json()
    return response
}

