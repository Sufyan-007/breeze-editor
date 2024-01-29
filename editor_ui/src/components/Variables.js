
export default function Variables({variable,...props}){
    return(
        <div {...props}>
            <div className=" ms-3 w-75 bg-light card">
                {variable.name}
            </div>
        </div>
    )
}