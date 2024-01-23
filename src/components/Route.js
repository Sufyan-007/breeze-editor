
export default function Route({route,...props}){
    return (
        <div {...props}>
            <div className="container-fluid">
                {route.path}
            </div>
        </div>
    )
}