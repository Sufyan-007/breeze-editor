export async function addHtmlChild(project_id, parent_html_id, component, child) {
    const response = await (await fetch("http://localhost:8000/editor/update-html-config/",
        {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({project_id,parent_html_id,component,child})
        }
    )).json()
    return response
}
export async function removeHtmlElem(project_id,component,html_id){
    const response = await (await fetch("http://localhost:8000/editor/update-html-config/",
        {
            method: "DELETE", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({project_id,component,html_id})
        }
    )).json()
    return response
}