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