import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteModuleById } from '../redux/ApiClientActions';
import { useParams } from 'react-router-dom';
import { deleteFunctionFromList } from '../redux/ApiClientReducers';
function ShowFunctions({ functionId, onFunctionClick, isAuth, moduleId, fileId }) {
  const func = useSelector((state) => state.services.functionsList[functionId]);
  const authFunc = useSelector((state) => state.services.moduleList[moduleId]?.auth_apis[functionId]);
  const displayName = isAuth ? authFunc?.operation_id : func?.operation_id;
  const shortName = displayName && displayName.length > 30 ? `${displayName.slice(0, 30)}...` : displayName;
  const { projectName } = useParams();
  const dispatch = useDispatch();

  const handleDelete = async (isAuth) => {
    if (!isAuth) {
      const res = await dispatch(
        deleteModuleById({ projectName, payload: { moduleId: moduleId, fileId: fileId, functionId: functionId } })
      ).unwrap();
      if (res && res.message) dispatch(deleteFunctionFromList({ functionId }));
    }
  };
  return (
    <div key={functionId} className="mx-4 me-2 my-1 d-flex justify-content-between">
      <span
        className={` ${func?.errors && func?.errors.root_errors.length > 0 ? 'text-danger' : ''}`}
        onClick={isAuth ? () => onFunctionClick() : () => onFunctionClick(func)}
        style={{ width: '90%', fontSize: '14px' }}
      >
        {shortName}
      </span>
      <div id="actions-div" className="d-flex">
        <i className="bi bi-trash3" alt="delete" onClick={() => handleDelete(isAuth)} title="delete-function"></i>
      </div>
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
