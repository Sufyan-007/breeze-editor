import '../styles/ProjectDisplay.css';

function TopBar() {
  return (
    <div className="br-background-primary rounded project-top-bar">
      <div className="col-md-4 d-xl-block d-none">
        <div className="blank"></div>
      </div>
      <div className="col-md-4 col-sm-6 d-flex justify-content-xl-center justify-content-start">
        <ul className="nav nav-pills custom-nav rounded br-background-secondary" id="pills-tab" role="tablist">
          <li className="nav-item me-2" role="presentation">
            <button
              className="nav-link"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="false"
            >
              <i className="bi bi-code-slash me-1"></i>
              Code
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="true"
            >
              <i className="bi bi-eye me-1"></i>
              Preview
            </button>
          </li>
        </ul>
      </div>
      <div className="col-md-4 col-sm-6 d-flex justify-content-end">
        <div className="d-flex" role="toolbar" aria-label="Toolbar with button groups">
          <div className="btn-group me-3" role="group" aria-label="First group">
            <button type="button" className="btn selected-tab py-0 px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-display"
                viewBox="0 0 16 16"
              >
                <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145" />
              </svg>
            </button>
            <button type="button" className="btn py-0 px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-laptop"
                viewBox="0 0 16 16"
              >
                <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5" />
              </svg>
            </button>
            <button type="button" className="btn py-0 px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-tablet"
                viewBox="0 0 16 16"
              >
                <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
              </svg>
            </button>
            <button type="button" className="btn py-0 px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-phone"
                viewBox="0 0 16 16"
              >
                <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
              </svg>
            </button>
          </div>
          <div className="btn-group second-group me-3" role="group" aria-label="Second group">
            <button type="button" className="btn btn-size color-text p-0 ms-3">
              -
            </button>
            <button type="button" className="btn color-text med-font py-0">
              100%
            </button>
            <button type="button" className="btn btn-size color-text p-0">
              +
            </button>
          </div>
          <div className="btn-group" role="group" aria-label="Third group">
            <button type="button" className="btn color-text py-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-clockwise"
                viewBox="0 0 16 16"
              >
                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
