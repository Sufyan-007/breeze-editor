import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
function ShowFunctions({ functionId, onFunctionClick, isAuth, moduleId }) {
  const func = useSelector((state) => state.services.functionsList[functionId]);
  const authFunc = useSelector((state) => state.services.moduleList[moduleId]?.auth_apis[functionId]);
  const displayName = isAuth ? authFunc?.operation_id : func?.operation_id;
  const shortName = displayName && displayName.length > 30 ? `${displayName.slice(0, 30)}...` : displayName;
  // console.log(func, functionId);

  return (
    <div key={functionId} className="mx-4 my-1 d-flex justify-content-between">
      <span
        className={` ${func?.errors && func?.errors.root_errors.length > 0 ? 'text-danger' : ''}`}
        onClick={isAuth ? () => onFunctionClick() : () => onFunctionClick(func)}
        style={{ width: '90%', fontSize: '14px' }}
      >
        {shortName}
      </span>
      <div id="actions-div" className="d-flex">
        <i className="bi bi-trash3" alt="delete"></i>
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
