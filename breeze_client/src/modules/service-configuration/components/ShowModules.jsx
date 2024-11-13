import { useEffect, useState } from 'react';
import { CustomTextInput } from '../../../common/fields';
import ShowFiles from './ShowFiles';
import { fetchFiles } from '../redux/ApiClientActions';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';

function ShowModules({
  folderKey,
  saveTitle,
  value,
  onAdd,
  setSelectedApi,
  setSelectedFile,
  setSelectedModule,
  setView,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const { projectName } = useParams();
  const dispatch = useDispatch();

  const files = useSelector(
    (state) => state.services.filesList,
    (prevFiles, nextFiles) => {
      return isEqual(prevFiles, nextFiles);
    }
  );

  const toggleModuleExpansion = async (name, id) => {
    if (!isOpen) {
      setSelectedModule({ name: name, id: id });
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (Object.keys(files).length === 0) {
      dispatch(fetchFiles({ projectName, payload: { category: 'api_client', module: folderKey } })).unwrap();
    }
  }, [dispatch, folderKey, projectName, files]);

  const handleInputChange = (value) => {
    setNewModuleTitle(value);
  };

  const toggleEditing = (title) => {
    if (editingModule === title) {
      setEditingModule(null);
      setNewModuleTitle('');
    } else {
      setEditingModule(title);
      setNewModuleTitle(title);
    }
  };
  return (
    <div key={folderKey} className="my-2">
      <div
        className={`mb-2 p-1 br-text-primary ${isOpen ? 'br-background-secondary' : 'br-background-primary'}`}
        onClick={() => toggleModuleExpansion(value.title, folderKey)}
        style={{ cursor: 'pointer' }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {editingModule === value.title ? (
              <CustomTextInput
                value={newModuleTitle}
                className="form-control form-control-sm br-text-primary br-background-primary"
                onChange={handleInputChange}
                onBlur={() => {
                  saveTitle(value.title, folderKey, newModuleTitle);
                  toggleEditing(value.title);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveTitle(value.title, folderKey, newModuleTitle);
                  } else if (e.key === 'Escape') {
                    toggleEditing(value.title);
                  }
                }}
                autoFocus
              />
            ) : (
              <div className="">
                <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/AAAAAA/module.png" alt="module" />
                <span className="mx-2 br-text-primary">
                  {value.title.length > 30 ? `${value.title.slice(0, 30)}...` : value.title}
                </span>
              </div>
            )}
          </div>
          <div>
            <i
              className="bi bi-plus-circle mx-1"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                onAdd();
              }}
              title="add-to-module"
            ></i>
            <i
              className="bi bi-pencil-square mx-1"
              onClick={(e) => {
                e.stopPropagation();
                toggleEditing(value.title);
              }}
              title="edit-module-name"
            ></i>
          </div>
        </div>
      </div>
      {isOpen && editingModule === null && (
        <div className="br-background-primary br-text-primary" style={{ cursor: 'pointer' }}>
          {value['files']?.length > 0 ? (
            value['files'].map((fileId) => (
              <ShowFiles
                key={fileId}
                fileId={fileId}
                moduleId={folderKey}
                moduleName={value.title}
                setSelectedApi={setSelectedApi}
                setSelectedFile={setSelectedFile}
                setSelectedModule={setSelectedModule}
                setView={setView}
              />
            ))
          ) : (
            <span className="m-2 br-text-primary">No services found</span>
          )}
        </div>
      )}
    </div>
  );
}
ShowModules.propTypes = {
  folderKey: PropTypes.string.isRequired,
  saveTitle: PropTypes.func.isRequired,
  value: PropTypes.shape({
    title: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
  setSelectedApi: PropTypes.func.isRequired,
  setSelectedFile: PropTypes.func.isRequired,
  setSelectedModule: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
};
export default ShowModules;
