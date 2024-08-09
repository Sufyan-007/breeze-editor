import { useEffect, useState , useCallback} from "react";
import { useSelector } from "react-redux";
import custom_ss from "../assets/icons/custom-component.png";
import homeImage from "../assets/icons/home_page.png";
import profileImage from "../assets/icons/profile_page.png";
import faqImage from "../assets/icons/FAQs.png";
import detailsImage from "../assets/icons/product_details_page.png";
import chartsImage from "../assets/icons/Charts_Page.png";
import landingPageImage from "../assets/icons/landingPage.png"
import { Row, Col } from "react-bootstrap";
import { router } from "../App";
import { useParams } from "react-router-dom";
import Offcanvas from "./common/Offcanvas";
import AddNewComponent from "./AddNewComponent";
import "../css/ProjectComponents.css";
import { getComponentPath } from "../services/ConfigService";

const ComponentImages = [
  homeImage,
  profileImage,
  detailsImage,
  chartsImage,
  landingPageImage
];

export default function ProjectComponents(props) {
  const config = useSelector((state) => state.config);
  const routerConfig = useSelector((state) => state.routerConfig);
  const [filePaths, setFilePaths] = useState({});
  const { projectName } = useParams();
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [error, setError] = useState("");

  const handleOpen = () => setIsOffcanvasOpen(true);
  const handleClose = () => setIsOffcanvasOpen(false);

  // console.log(routerConfig,"routes for pages");
  useEffect(() => {
    fetchFilePath(projectName);
  }, []);

  const fetchFilePath = async (projectName) => {
    console.log(projectName, "project name");
    try {
      const data = await getComponentPath(projectName);

      if (data) {
        setFilePaths(data);
      } else {
        setError(data.error || "Error fetching file path");
      }
    } catch (error) {
      setError("Network error");
    }
  };

    // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce delay

    return () => {
      clearTimeout(handler); // Cleanup
    };
  }, [searchTerm]);


  const handleClick = (key) => {
    const path = `/project/${projectName}/component/${key}`;
    router.navigate(path);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredComponents = Object.entries(
    config.custom_components || {}
  ).filter(
    ([key, value]) =>
      key.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const filteredPages = Object.entries(config.pages || {}).filter(
    ([key, value]) =>
      key.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) 
  );


  const getImageforComponent = (index) => {
    return ComponentImages[index % ComponentImages.length];
  };

 const getRoutePath = (key) => {
   if (!routerConfig || !routerConfig.routes) {
     console.error("routerConfig or routerConfig.routes is undefined");
     return "Config not loaded";
   }

   const matchingRoute = Object.values(routerConfig.routes).find(
     (route) => route.component === key
   );

   return matchingRoute ? matchingRoute.path : "Path not found";
 };


  console.log(routerConfig,"see the routes");
  return (
    <div className="d-flex container-fluid flex-column h-100 text-white">
      <div className="row mb-2">
        <div className="col p-0 bg-dark d-flex justify-content-between align-items-center">
          <div className="text-left mt-2 mx-2">
            <h4>Components</h4>
          </div>
        </div>
      </div>
      <div className="row mb-1">
        <div
          className="col d-flex justify-content-end align-items-center"
          style={{ paddingRight: "20px" }}
        >
          <input
            type="search"
            className="form-control mr-2 custom-search"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              maxWidth: "200px",
              backgroundColor: "rgb(33, 37, 41)",
              marginRight: "5px",
              color: "white",
            }}
          />
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleOpen}
            style={{
              marginRight: "10px",
              border: "2px solid white",
              backgroundColor: "#303033",
              color: "white",
            }}
          >
            Add Component
          </button>
        </div>
      </div>

      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={handleClose}
        title="New Component"
        width="400px"
      >
        <AddNewComponent />
      </Offcanvas>

      <div className="row">
        {filteredComponents.map(([key, value], index) => (
          <div className="col-12 my-1" key={key}>
            <div
              className="card p-0 text-white position-relative border-0"
              style={{ backgroundColor: "rgb(33, 37, 41)" }}
            >
              <Row className="d-flex align-items-center">
                <Col sm={2}>
                  <img
                    src={getImageforComponent(index)}
                    className="card-img border-0"
                    alt="No Screenshot"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </Col>
                <Col
                  sm={8}
                  className="d-flex flex-column justify-content-center"
                >
                  <Row>
                    <Col sm={6}>
                      <h3 style={{ marginBottom: "10px", paddingTop: "3px" }}>
                        {key}
                      </h3>
                      <p className="card-text">
                        Generated File: {filePaths[key] || "Not Available"}
                      </p>
                    </Col>

                    <Col sm={6} style={{ marginTop: "48px" }}>
                      <p>Component Type : {value.type}</p>
                    </Col>
                  </Row>
                </Col>
                <Col sm={2} className="d-flex justify-content-end">
                  <button
                    onClick={() => handleClick(key)}
                    className="btn btn-primary"
                    style={{
                      marginRight: "10px",
                      border: "2px solid blue",
                      backgroundColor: "#303033",

                      color: "blue",
                    }}
                  >
                    Edit
                  </button>
                </Col>
              </Row>
            </div>
          </div>
        ))}
        {filteredPages.map(([key, value], index) => (
          <div className="col-12 my-1" key={key}>
            <div
              className="card p-0 text-white position-relative border-0"
              style={{ backgroundColor: "rgb(33, 37, 41)" }}
            >
              <Row className="d-flex align-items-center">
                <Col sm={2}>
                  <img
                    src={getImageforComponent(index)}
                    className="card-img border-0"
                    alt="No Screenshot"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                </Col>
                <Col
                  sm={8}
                  className="d-flex flex-column justify-content-center"
                >
                  <Row>
                    <Col sm={6}>
                      <h3 style={{ marginBottom: "10px", paddingTop: "3px" }}>
                        {key}
                      </h3>
                      <p className="card-text">
                        Generated File: {filePaths[key] || "Not Available"}
                      </p>
                    </Col>

                    <Col sm={6} style={{ marginTop: "10px" }}>
                      <p>Route: {getRoutePath(key)}</p>
                      <p>Component Type : {value.type || "PAGE"}</p>
                    </Col>
                  </Row>
                </Col>
                <Col sm={2} className="d-flex justify-content-end">
                  <button
                    onClick={() => handleClick(key)}
                    className="btn btn-primary"
                    style={{
                      marginRight: "10px",
                      border: "2px solid blue",
                      backgroundColor: "#303033",

                      color: "blue",
                    }}
                  >
                    Edit
                  </button>
                </Col>
              </Row>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
