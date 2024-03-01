import { useEffect, useState } from "react";

export default function Loader({ loader, children }) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            await loader()
            setLoading(false)
        }
        load()  
    }, [loader])

    return (
        loading ? <div>Loading...</div> : children
    )
}