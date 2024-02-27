export default function EntityConfig({schema,selectedEntity ,...props}){
    
    return (
        <div className="container-fluid h-100">
            Schema : {selectedEntity}
        </div>
    )
}