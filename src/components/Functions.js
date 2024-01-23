export default function Functions({func,...props}){
    return(
        <div {...props}>
            <div className=" ms-3 w-75 bg-light card">
                {func.name}
            </div>
        </div>
    )
}