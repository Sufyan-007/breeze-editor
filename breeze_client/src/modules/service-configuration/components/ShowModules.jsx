import { useEffect, useState } from 'react';
import { CustomTextInput } from '../../../common/fields';
import ShowFiles from './ShowFiles';
import { deleteModuleById, fetchFiles, fetchModules } from '../redux/ApiClientActions';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { fetchFolderConfig } from '../../../redux/directory_management/directory_actions';

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
  const [showActions, setShowActions] = useState(false);
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
    const trimmedNewName = value.trim();
    setNewModuleTitle(trimmedNewName);
  };

  const handleDeleteModule = async (moduleId) => {
    await dispatch(deleteModuleById({ projectName, payload: { moduleId } })).unwrap();
    await dispatch(fetchModules({ projectName, payload: { category: 'api_client' } })).unwrap();
    await dispatch(fetchFolderConfig({ id: 'ROOT', projectName, depth: 3 })).unwrap();
    setShowActions(false);
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
  const handleActionsClick = (e) => {
    e.stopPropagation();
    setShowActions((prev) => !prev);
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
                  const trimmedNewName = newModuleTitle.trim();
                  if (value.title !== trimmedNewName && trimmedNewName.length !== 0) {
                    saveTitle(value.title, folderKey, trimmedNewName);
                  }
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
                <span className="mx-2 br-text-primary" style={{ fontSize: '16px' }}>
                  {value.title.length > 30 ? `${value.title.slice(0, 30)}...` : value.title}
                </span>
              </div>
            )}
          </div>
          <div>
            <i
              className="bi bi-three-dots-vertical mx-1"
              title="module-actions"
              onClick={handleActionsClick}
              style={{ cursor: 'pointer' }}
            ></i>

            {showActions && (
              <div
                className="dropdown-menu show br-background-secondary d-flex justify-content-evenly"
                style={{ position: 'absolute', zIndex: 10 }}
              >
                <i
                  className="bi bi-gear mx-1 br-text-primary"
                  title="module-properties"
                  onClick={(e) => {
                    setSelectedModule({ name: value.title, id: folderKey });
                    e.stopPropagation();
                    setView('MODULE_SETTINGS');
                    setShowActions(false);
                  }}
                ></i>
                <i
                  className="bi bi-plus-circle mx-1 br-text-primary"
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(value.title, folderKey);
                    setShowActions(false);
                  }}
                  title="add-function"
                ></i>
                <i
                  className="bi bi-pencil-square mx-1 br-text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModule({ name: value.title, id: folderKey });
                    toggleEditing(value.title);
                    setShowActions(false);
                  }}
                  title="edit-module-name"
                ></i>
                <i
                  className="bi bi-trash mx-1 br-text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteModule(folderKey);
                  }}
                  title="delete-module"
                ></i>
              </div>
            )}
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
            <span className="m-2 br-text-primary" style={{ fontSize: '16px' }}>
              No Files found
            </span>
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
