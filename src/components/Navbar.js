export default function Navbar({ children, ...props }) {
    return (
        <div className=" navbar row" style={{ backgroundColor: "#151518" }}>
            <div className="container-fluid">
                <a href="/" className="btn px-0 navbar-brand text-white">
                    Breeze Studio
                </a>
                {children}
            </div>
        </div>
    )
}