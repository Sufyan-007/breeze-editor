import { useSelector } from 'react-redux'
import RootComponent from './RootComponent'
export default function ComponentTree({ ...props }) {
    const config = useSelector((state) => state.config)
    
    return (
        <div {...props}>
            <div className="row mb-3 fw-bold">
                Components
            </div>
            {Object.entries(config).map(([k, v]) => <RootComponent key={k} name={k} component={v} className=" row m-1 " />)}
        
        </div>
    )
}