import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
// import { updateProject } from '../../services/ProjectService';
// import Toast from 'react-bootstrap/Toast';
// import ToastContainer from 'react-bootstrap/ToastContainer';
import { initialGeneralSettingsConfig } from '../constants/SettingsFormConstants';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectConfig } from '../../../redux/project/projectActions';
import { getProjectLogo } from '../../project/services/projectService';

const GeneralSettings = () => {
  const navigate = useNavigate();
  const { projectName } = useParams();

  const [formData, setFormData] = useState(initialGeneralSettingsConfig);

  const [appDetails, setAppDetails] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoDeleted, setLogoDeleted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const fileInputRef = useRef(null);
  const { projectConfig } = useSelector((state) => state.project);
  // console.log(projectConfig);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjectConfig({ projectName }))
      .unwrap()
      .then((res) => {
        setAppDetails(res);
        setFormData({
          name: res.projectName,
          author: res.author,
          description: res.description,
        });
        setInitialValues({
          name: res.projectName,
          author: res.author,
          description: res.description,
        });
        if (res.logoId && res.logoId !== 'null' && res.logoId !== '') {
          getProjectLogo(res.name, res.logoId)
            .then((response) => response.blob())
            .then((blob) => {
              const logoBlobUrl = URL.createObjectURL(blob);
              setLogoPreview(logoBlobUrl);
            })
            .catch((error) => console.error('Error fetching logo:', error));
        } else {
          setLogoPreview('');
        }
      });
  }, [projectName]);

  const handleChange = useCallback((field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  }, []);

  useEffect(() => {
    const hasChanged =
      formData.name !== initialValues.name ||
      formData.author !== initialValues.author ||
      formData.description !== initialValues.description ||
      logoFile !== null ||
      logoDeleted;
    setIsChanged(hasChanged);
  }, [formData, initialValues, logoFile, logoDeleted]);

  const handleUploadIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('newProjectName', formData.name);
    submitData.append('newAuthor', formData.author);
    submitData.append('newDescription', formData.description);
    submitData.append('oldConfig', JSON.stringify(appDetails));

    if (logoFile) {
      submitData.append('logo', logoFile);
    } else if (logoDeleted) {
      submitData.append('logo', 'null');
    }

    // updateProject(submitData).then((res) => {
    //   setShowSaveToast(true);
    //   navigate(`/project/${res.body.name}/settings`, { replace: true });
    // });
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
    setLogoPreview('');
    handleChange('logo', '');
    setLogoDeleted(true);
  };

  return (
    <div>
      <h2>General Settings</h2>
      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit}>
            <div className="col-lg-5 col-md-7">
              <div className="d-flex justify-content-between align-items-center m-2">
                <div className="">Application Name:</div>
                <div className="form-group" id="">
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                  {/* {errors.name && <div className="text-danger">{errors.name.message}</div>} */}
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center m-2">
                <div className="">Author Name:</div>
                <div className="form-group" id="">
                  <input
                    type="text"
                    className="form-control"
                    value={formData.author}
                    onChange={(e) => handleChange('author', e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center m-2">
                <div className="">Description:</div>
                <div className="form-group" id="">
                  <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center m-2">
                <div className="">Logo:</div>
                <div className="form-group" id="">
                  <div
                    className="settings-logo-container"
                    style={!logoPreview ? { cursor: 'pointer' } : {}}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={!logoPreview ? handleUploadIconClick : undefined}
                  >
                    {logoPreview ? (
                      <>
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="settings-img-thumbnail"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        {isHovered && (
                          <i
                            type="button"
                            style={{ color: 'red', fontSize: 'x-large' }}
                            className="bi bi-trash settings-delete-logo-button"
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
                      style={{ display: 'none' }}
                    />
                  )}
                </div>
              </div>
            </div>
            <button className="btn btn-primary my-3" type="submit" disabled={!isChanged}>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
