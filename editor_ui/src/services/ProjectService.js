export async function createNewProject(projectDetails){
    const response = await (await fetch("http://localhost:8000/editor/new-project/",
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(projectDetails) }
        )).json()
    return response
}

export async function reGenerateProject(projectName){
    const respnse = await (await fetch("http://localhost:8000/editor/update-project/"+projectName+"/",
        {method:"PUT",headers: { 'Content-Type': 'application/json' }}
    )).json()
    return respnse
}

export async function deleteProject(projectName){
    const response = await fetch("http://localhost:8000/editor/delete-project/"+projectName+"/",
        {method:"DELETE",headers: { 'Content-Type': 'application/json' }}
    )
    const status = response.status
    const body = await response.json()
    await new Promise(r => setTimeout(r, 2000));
    return {status,body}
}