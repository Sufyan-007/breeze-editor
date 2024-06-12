export async function addHtmlChild(project_id, parent_html_id, component, child) {
    const response = await (await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/update-html-config/`,
        {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({project_id,parent_html_id,component,child})
        }
    )).json()
    return response
}
export async function removeHtmlElem(project_id,component,html_id){
    const response = await (await fetch(`${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/update-html-config/`,
        {
            method: "DELETE", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({project_id,component,html_id})
        }
    )).json()
    return response
}