
export default function Route({ route, ...props }) {
    return (
        <div {...props}>
            <div className="container-fluid ">
                <div className="row">
                    <div className="col-3">{route.path}</div>
                    <div className="col">{route.component? "component : "+route.component:"Redirect --> "+route.redirectTo}</div>
                </div>
            </div>
        </div>
    )
}