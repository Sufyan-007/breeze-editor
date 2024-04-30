export async function getComponents(project_id){
    const response = await (await fetch("http://localhost:8000/config-reader/get-components/",
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({project_id}) }
        )).json()
    return response
}

export async function getHtml(project_id,component,html_id){
    const response = await (await fetch("http://localhost:8000/editor/get-html-config/",
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({project_id,component,html_id}) }
        )).json()
    return response
}