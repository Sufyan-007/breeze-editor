import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteModuleById, fetchModules, transferToAuthFile } from '../redux/ApiClientActions';
import { useParams } from 'react-router-dom';
import { deleteFunctionFromList } from '../redux/ApiClientReducers';
import CustomModal from '../../../common/display/modal/BreezeModal';
import { useState } from 'react';
import { CustomSelectField } from '../../../common/fields';
function ShowFunctions({ functionId, onFunctionClick, isAuth, moduleId, fileId, setSelectedAuthApi }) {
  const func = useSelector((state) => state.services.functionsList[functionId]);
  const authFunc = useSelector((state) => state.services.moduleList[moduleId]?.auth_apis[functionId]);
  const displayName = isAuth ? authFunc?.operation_id : func?.operation_id;
  const shortName = displayName && displayName.length > 30 ? `${displayName.slice(0, 30)}...` : displayName;
  const { projectName } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState({});
  const dispatch = useDispatch();
  const allFunctions = useSelector((state) => state.services.functionsList);

  const options = Object.values(allFunctions)
    .map((object) => ({
      label: object.operation_id,
      value: object.id,
      fileId: object.file_id,
      moduleId: object.module_id,
    }))
    .filter((option) => option.moduleId === moduleId);
  options.push({ label: 'select', value: '', hidden: true, selected: true });

  const handleDelete = async (isAuth) => {
    if (!isAuth) {
      const res = await dispatch(
        deleteModuleById({ projectName, payload: { moduleId: moduleId, fileId: fileId, functionId: functionId } })
      ).unwrap();
      if (res && res.message) dispatch(deleteFunctionFromList({ functionId }));
    }
  };
  const handleAuthFunctionMove = async () => {
    if (Object.keys(selectedFunction).length > 0) {
      const res = await dispatch(
        transferToAuthFile({
          projectName,
          payload: {
            module_id: selectedFunction.moduleId,
            filename: selectedFunction.fileId,
            id: selectedFunction.value,
            is_imported: true,
            replaced_function_id: functionId,
          },
        })
      ).unwrap();
      if (res && res.message) {
        setModalVisible(false);
        setSelectedAuthApi({});
        await dispatch(fetchModules({ projectName, payload: { category: 'api_client' } })).unwrap();
        dispatch(deleteFunctionFromList({ functionId: selectedFunction.value }));
      }
    }
  };
  return (
    <div key={functionId} className="mx-4 me-2 my-1 d-flex justify-content-between br-cursor-pointer">
      <span
        className={` ${func?.errors && func?.errors.root_errors.length > 0 ? 'text-danger' : ''}`}
        onClick={isAuth ? () => onFunctionClick() : () => onFunctionClick(func)}
        style={{ width: '90%', fontSize: '14px' }}
      >
        {shortName}
      </span>
      <div id="actions-div" className="d-flex">
        {isAuth && (
          <i className="bi bi-upload mx-2" title="import-from-functions" onClick={() => setModalVisible(true)}></i>
        )}
        {!isAuth && (
          <i className="bi bi-trash3" alt="delete" onClick={() => handleDelete(isAuth)} title="delete-function"></i>
        )}
      </div>
      <CustomModal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        header={{ title: 'Import from functions' }}
        footer={{
          buttons: [
            { label: 'Move', onClick: () => handleAuthFunctionMove(), type: 'button' },
            {
              label: 'Cancel',
              onClick: () => {
                setModalVisible(false);
                setSelectedFunction({});
              },
              type: 'button',
            },
          ],
        }}
      >
        {/* we will replace this with searchable select  */}
        <CustomSelectField
          options={options}
          value={selectedFunction?.value}
          className="form-select br-form-select form-select-sm mt-3"
          config={{
            label: 'Select Function',
            groupClass: 'form-group mb-2 mx-2',
          }}
          onChange={(value) => setSelectedFunction(value)}
          sendSelectedOption={true}
        />
        {/* <Select
          className="br-background-secondary feature-fixed-select"
          classNamePrefix="feature-react-select"
          options={options}
          value={selectedFunction?.value}
          onChange={(value) => setSelectedFunction(value)}
          placeholder="Select User"
          isSearchable
        /> */}
      </CustomModal>
    </div>
  );
}
ShowFunctions.propTypes = {
  functionId: PropTypes.string.isRequired,
  onFunctionClick: PropTypes.func.isRequired,
  isAuth: PropTypes.bool.isRequired,
  moduleId: PropTypes.string.isRequired,
};
export default ShowFunctions;
