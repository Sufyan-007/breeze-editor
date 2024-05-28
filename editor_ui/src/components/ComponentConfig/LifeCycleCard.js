import React, { useEffect, useRef } from "react";
import { Card, ButtonGroup, Button, Form, Row, Col } from "react-bootstrap";
import MonacoEditor from "../common/MonacoEditor";
import Multiselect from "multiselect-react-dropdown";
import DeleteIcon from "../../assets/icons/delete-trash.svg";
import EditIcon from "../../assets/icons/edit-icon.svg";
import ViewIcon from "../../assets/icons/view-eye.svg";

function LifeCycleCard({
  lifeCycleObj,
  onDelete,
  constantsList,
  updateLifeCycle,
}) {
  const [mode, setMode] = React.useState("view");
  const [lifecycle, setLifecycle] = React.useState(lifeCycleObj);
  const offcanvasRef = useRef(null);
  const offcanvasInstance = useRef(null);

  useEffect(() => {
    setLifecycle(lifeCycleObj);
  }, [lifeCycleObj]);

  useEffect(() => {
    offcanvasInstance.current = new window.bootstrap.Offcanvas(
      offcanvasRef.current
    );
  }, []);

  const handleView = () => {
    setMode("view");
    offcanvasInstance.current.show();
  };

  const handleEdit = () => {
    setMode("edit");
    offcanvasInstance.current.show();
  };

  const handleClose = () => {
    offcanvasInstance.current.hide();
  };

  return (
    <>
      <Card className="mb-2 bg-dark">
        <Card.Body className="p-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="font-weight-bold text-white">
              {lifeCycleObj?.name}
            </div>
            <ButtonGroup>
              <Button variant="dark" onClick={handleView} title="View">
                <img src={ViewIcon} alt="" height={24} className="mx-2" />
              </Button>
              <Button variant="dark" onClick={handleEdit} title="Edit">
                <img src={EditIcon} alt="" height={24} className="mx-2" />
              </Button>
              <Button variant="dark" onClick={onDelete} title="Delete">
                <img src={DeleteIcon} alt="" height={24} className="mx-2" />
              </Button>
            </ButtonGroup>
          </div>
        </Card.Body>
      </Card>

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
        ref={offcanvasRef}
        style={{ width: "500px"}}
        data-bs-theme="dark"
      >
        <div className="offcanvas-header pb-0">
          <h5 className="offcanvas-title" id="offcanvasRightLabel">
            {mode === "view" ? "View Lifecycle" : "Edit Lifecycle"}
          </h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={handleClose}
          ></button>
        </div>
        <div className="offcanvas-body">
          <Form>
            <Row className="mb-2">
              <Col>
                <Form.Group>
                  <Form.Label>Lifecycle</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    value={lifeCycleObj.lifecycleType}
                    disabled
                  >
                    <option>Select Lifecycle</option>
                    <option value="onEveryMount">onEveryMount</option>
                    <option value="onComponentMount">onComponentMount</option>
                    <option value="onMountAndUnmount">onMountAndUnmount</option>
                    <option value="onUnmount">onUnmount</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {["onComponentMount", "onMountAndUnmount", "onUnmount"].includes(
              lifeCycleObj.lifecycleType
            ) && (
              <Row className="mb-2">
                <Col>
                  <Form.Group>
                    <Form.Label>Dependent Vars</Form.Label>
                    <Multiselect
                      className="form-control p-0 border-0 text-gray"
                      options={constantsList}
                      selectedValues={lifeCycleObj?.dependentVars}
                      onSelect={(selectedList) => {
                        setLifecycle((state) => {
                          return { ...state, dependentVars: selectedList };
                        });
                      }}
                      onRemove={(selectedList) => {
                        setLifecycle((state) => {
                          return { ...state, dependentVars: selectedList };
                        });
                      }}
                      isObject={false}
                      showCheckbox={true}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            {["onEveryMount", "onComponentMount", "onMountAndUnmount"].includes(
              lifeCycleObj.lifecycleType
            ) && (
              <Row className="mb-2">
                <Col>
                  <Form.Group>
                    <Form.Label>Function Body</Form.Label>
                    <MonacoEditor
                      defaultValue={lifeCycleObj?.implementation?.body}
                      onChange={(value) => {
                        setLifecycle((state) => {
                          return {
                            ...state,
                            implementation: {
                              ...state.implementation,
                              body: value,
                            },
                          };
                        });
                      }}
                      height="150px"
                      width="450px"
                      id={`function-body-${lifeCycleObj.name}`}
                      language="javascript"
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            {["onUnmount", "onMountAndUnmount"].includes(
              lifeCycleObj.lifecycleType
            ) && (
              <Row className="mb-2">
                <Col>
                  <Form.Group>
                    <Form.Label>Return Body</Form.Label>
                    <MonacoEditor
                      defaultValue={lifeCycleObj?.implementation?.returnBody}
                      onChange={(value) => {
                        setLifecycle((state) => {
                          return {
                            ...state,
                            implementation: {
                              ...state.implementation,
                              returnBody: value,
                            },
                          };
                        });
                      }}
                      height="150px"
                      width="450px"
                      id={`return-body-${lifeCycleObj.name}`}
                      language="javascript"
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
            <div className="d-flex justify-content-start">
              {mode === "edit" && (
                <>
                  <Button
                    variant="secondary"
                    className="me-3"
                    onClick={() => {
                      updateLifeCycle(lifecycle);
                      handleClose();
                    }}
                  >
                    Update
                  </Button>
                </>
              )}
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default LifeCycleCard;
