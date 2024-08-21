import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useParams } from "react-router";
import { getComponents } from "../../../services/ComponentReadService";

export default function AddChildModal({ show, update }) {
  const { projectName } = useParams();
  const [selectedElement, setSelectedElement] = useState("");
  const [searchedElement, setSearchedElement] = useState("");
  const [allElementOptions, setAllElementOptions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const resp = await getComponents(projectName);
      let allHtmlTags = resp.HTML.map((obj) => {
        obj.type = "HTML";
        return obj;
      });
      let allCustomTags = resp.CUSTOM.map((obj) => {
        obj.type = "CUSTOM";
        return obj;
      });
      let allThirdPartyTags = [];
      for (const [key, value] of Object.entries(resp.THIRD_PARTY)) {
        allThirdPartyTags.push(
          ...value.map((obj) => {
            obj.type = "THIRD_PARTY";
            obj.libraryName = key;
            return obj;
          })
        );
      }

      setAllElementOptions([
        ...allHtmlTags,
        ...allThirdPartyTags,
        ...allCustomTags,
      ]);
    };
    load();
  }, [projectName]);

  useEffect(() => {
    setSelectedElement("");
    setSearchedElement("");
  }, [show]);

  function closeModal(add) {
    if (add) {
      update(selectedElement);
      setSelectedElement("");
      setSearchedElement("");
    } else {
      update(null);
      setSelectedElement("");
      setSearchedElement("");
    }
  }

  return (
    <Modal show={show} onHide={() => closeModal(false)}>
      <Modal.Header>
        {!selectedElement
          ? "Select Child Element"
          : "selected element: <" + selectedElement.component.name + ">"}
      </Modal.Header>
      <Modal.Dialog style={{}}>
        <Modal.Body style={{ overflowY: "auto", height: "50vh" }}>
          <div>
            <div
              data-bs-theme="dark"
              className=""
              type="button"
              onChange={(e) => setSearchedElement(e.target.value)}
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder={"Search desired elements"}
                aria-label="Search"
                value={searchedElement}
              />
            </div>
          </div>

          <div className="">
            <div className="card my-1" data-bs-theme="dark">
              <ul className="list-group list-group-flush">
                {searchedElement &&
                  allElementOptions
                    .filter((obj) =>
                      obj.name
                        .toLowerCase()
                        .includes(searchedElement.toLowerCase())
                    )
                    .map((component, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between"
                        style={{
                          cursor: "pointer",
                          flexWrap: "wrap",
                          overflowY: "auto",
                        }}
                        onClick={() =>
                          setSelectedElement({
                            elementType: component.type,
                            component: {
                              id: component.id,
                              name: component.name,
                              ...(component.libraryName && {
                                libraryName: component.libraryName,
                              }),
                            },
                          })
                        }
                        title={
                          component.type === "THIRD_PARTY"
                            ? "lib... --> " + component.libraryName
                            : ""
                        }
                      >
                        <div>{component.name}</div>
                        <div>
                          <i className="text-muted" style={{ fontSize: "55%" }}>
                            {" " + component.type}
                          </i>
                        </div>
                      </li>
                    ))}
                {!searchedElement &&
                  allElementOptions &&
                  allElementOptions.map((component, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between"
                      style={{
                        cursor: "pointer",
                        flexWrap: "wrap",
                        overflowY: "auto",
                      }}
                      onClick={() => {
                        setSelectedElement({
                          elementType: component.type,
                          component: {
                            id: component.id,
                            name: component.name,
                            ...(component.libraryName && {
                              libraryName: component.libraryName,
                            }),
                          },
                        });
                      }}
                      title={
                        component.type === "THIRD_PARTY"
                          ? "Lib.. --> " + component.libraryName
                          : ""
                      }
                    >
                      <div>{component.name}</div>
                      <div>
                        <i className="text-muted" style={{ fontSize: "55%" }}>
                          {" " + component.type}
                        </i>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </Modal.Body>
      </Modal.Dialog>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={() => closeModal(false)}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={() => closeModal(true)}>
          Add
        </button>
      </Modal.Footer>
    </Modal>
  );
}
