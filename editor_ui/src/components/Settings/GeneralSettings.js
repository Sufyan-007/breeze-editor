import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { getAppBasicConfig } from "../../services/ConfigService";
import { updateProject } from "../../services/ProjectService";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const GeneralSettings = () => {
  const navigate = useNavigate();
  const { projectName } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const [appDetails, setAppDetails] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoDeleted, setLogoDeleted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const fileInputRef = useRef(null);

  const watchFields = watch();

  useEffect(() => {
    getAppBasicConfig(projectName).then((res) => {
      setAppDetails(res);
      setValue("name", res.projectName);
      setValue("author", res.author);
      setValue("description", res.description);

      setInitialValues({
        name: res.projectName,
        author: res.author,
        description: res.description,
      });

      if (res.logo && res.logo !== "null" && res.logo !== "") {
        const logoUrl = `http://localhost:8000/editor/file-upload/${res.name}/${res.logo}`;
        setLogoPreview(logoUrl);
      } else {
        setLogoPreview("");
      }
    });
  }, [projectName, setValue]);

  useEffect(() => {
    const hasChanged =
      watchFields.name !== initialValues.name ||
      watchFields.author !== initialValues.author ||
      watchFields.description !== initialValues.description ||
      logoFile !== null ||
      logoDeleted;
    setIsChanged(hasChanged);
  }, [watchFields, initialValues, logoFile, logoDeleted]);

  const toggleShowSaveToast = () => setShowSaveToast(!showSaveToast);

  const handleUploadIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const submitForm = (data) => {
    const formData = new FormData();
    formData.append("newProjectName", data.name);
    formData.append("newAuthor", data.author);
    formData.append("newDescription", data.description);
    formData.append("oldConfig", JSON.stringify(appDetails));

    if (logoFile) {
      formData.append("logo", logoFile);
    } else if (logoDeleted) {
      formData.append("logo", "null");
    }

    updateProject(formData).then((res) => {
      toggleShowSaveToast();
      navigate(`/project/${res.body.name}/settings`, { replace: true });
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoDelete = () => {
    setLogoFile(null);
    setLogoPreview("");
    setValue("logo", "");
    setLogoDeleted(true);
  };

  return (
    <div>
      <h2>General Settings</h2>
      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="col-lg-5 col-md-7">
              <div className="d-flex justify-content-between align-items-center m-2">
                <div className="">Application Name:</div>
                <div className="form-group" id="">
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    placeholder="Name of the Application"
                    {...register("name", {
                      required: "Application name is required",
                    })}
                  />
                  {errors.name && (
                    <div className="text-danger">{errors.name.message}</div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center m-2">
                <div className="">Author Name:</div>
                <div className="form-group" id="">
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    placeholder="Author"
                    {...register("author")}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center m-2">
                <div className="">Description:</div>
                <div className="form-group" id="">
                  <textarea
                    className="form-control form-control-sm"
                    type="textarea"
                    placeholder="Description"
                    {...register("description")}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center m-2">
                <div className="">Logo:</div>
                <div className="form-group" id="">
                  <div
                    className="logo-container"
                    style={!logoPreview ? { cursor: "pointer" } : {}}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={!logoPreview ? handleUploadIconClick : undefined}
                  >
                    {logoPreview ? (
                      <>
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="custom-img-thumbnail"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {isHovered && (
                          <i
                            type="button"
                            style={{ color: "red", fontSize: "x-large" }}
                            className="bi bi-trash delete-logo-button"
                            onClick={handleLogoDelete}
                          ></i>
                        )}
                      </>
                    ) : (
                      <i className="bi bi-upload upload-icon"></i>
                    )}
                  </div>
                  {!logoPreview && (
                    <input
                      ref={fileInputRef}
                      className="form-control form-control-sm"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      style={{ display: "none" }}
                    />
                  )}
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary my-3"
              type="submit"
              disabled={!isChanged}
            >
              Save
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
        <Toast
          bg={"primary"}
          show={showSaveToast}
          onClose={toggleShowSaveToast}
          delay={2000}
          autohide
        >
          <Toast.Header closeButton={false}>
            <strong>Success..!</strong>
          </Toast.Header>
          <Toast.Body>Project Details are Updated</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default GeneralSettings;
