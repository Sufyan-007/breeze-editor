import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Avatar from '../../assets/images/Ellipse 1.png';
import BreezeOffCanvas from '../display/offcanvas/BreezeOffcanvas';

function ProfileOffCanvas({ show, onClose, username, userRole, onSave }) {
  const [formData, setFormData] = useState({ name: username, role: userRole });
  const [initialValues, setInitialValues] = useState({ name: username, role: userRole });
  const [profilePicPreview, setProfilePicPreview] = useState(Avatar);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const hasChanged =
      formData.name !== initialValues.name || formData.role !== initialValues.role || profilePicFile !== null;
    setIsChanged(hasChanged);
  }, [formData, initialValues, profilePicFile]);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleUploadIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicDelete = () => {
    setProfilePicFile(null);
    setProfilePicPreview(null);
    setIsChanged(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = { ...formData };
    if (profilePicFile) {
      updatedData.profilePic = profilePicFile;
    }

    onSave(updatedData);

    setInitialValues({ name: formData.name, role: formData.role });
    setProfilePicFile(null);
    setIsChanged(false);
  };

  return (
    <BreezeOffCanvas show={show} onClose={onClose} title="Profile Settings" placement="end" size="30%">
      <form className="d-flex flex-column align-items-center p-3" onSubmit={handleSubmit}>
        <div className="form-group text-center">
          <div
            className={`profile-pic-container position-relative ${!profilePicPreview ? 'empty-profile' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={!profilePicPreview ? handleUploadIconClick : undefined}
            style={{
              cursor: 'pointer',
              border: !profilePicPreview ? '2px dashed #ccc' : 'none',
              borderRadius: '50%',
              width: '100px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {profilePicPreview ? (
              <>
                <img
                  src={profilePicPreview}
                  alt="Profile Preview"
                  className="rounded-circle mb-3"
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                  }}
                />
                {isHovered && (
                  <i
                    type="button"
                    style={{
                      color: 'red',
                      fontSize: 'large',
                      position: 'absolute',
                      top: '36px',
                      right: '40px',
                    }}
                    className="bi bi-trash"
                    onClick={handleProfilePicDelete}
                  ></i>
                )}
              </>
            ) : (
              <i className="bi bi-upload upload-icon" style={{ fontSize: '2rem', color: '#ccc' }}></i>
            )}
          </div>
          {!profilePicPreview && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: 'none' }}
            />
          )}
        </div>

        <div className="form-group w-100 mt-3">
          <label className="form-label br-text-primary">Name</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group w-100 mt-3">
          <label className="form-label br-text-primary">Role</label>
          <input
            type="text"
            className="form-control"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            placeholder="Enter your role"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-4" disabled={!isChanged}>
          Save Changes
        </button>
      </form>
    </BreezeOffCanvas>
  );
}

ProfileOffCanvas.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ProfileOffCanvas;
