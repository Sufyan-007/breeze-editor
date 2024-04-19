
export default function Navbar({ leftContent, rightContent, ...props }) {
    return (
        <div className="navbar row" style={{ backgroundColor: "#151518" }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between w-100">
            <div className="d-flex align-items-center">
              <a href="/" className="btn px-0 navbar-brand fw-bold text-white">
                Breeze Studio
              </a>
              {leftContent}
            </div>
            <div className="navbar-right d-flex align-items-center">
              {rightContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
