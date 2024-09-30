import { useState } from 'react';
import PropTypes from 'prop-types';
import ParamForm from './ParamForm';

function FunctionParams({ params, setParams }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddOrEditParam = (paramData) => {
    if (editIndex !== null) {
      const updatedParams = params.map((param, index) => (index === editIndex ? paramData : param));
      setParams(updatedParams);
    } else {
      setParams([...params, paramData]);
    }
    setIsFormVisible(false);
    setEditIndex(null);
  };

  const handleEditParam = (index) => {
    setEditIndex(index);
    setIsFormVisible(true);
  };

  const handleDeleteParam = (index) => {
    setParams(params.filter((_, i) => i !== index));
  };

  const handleAddClick = () => {
    setEditIndex(null);
    setIsFormVisible(true);
  };

  return (
    <div className="function-params">
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="br-text-primary fw-bold mb-0">Function Parameters</h6>
        <div onClick={handleAddClick} role="button">
          <i className="bi bi-plus-circle"></i>
        </div>
      </div>
      {params.length > 0 && <div className="br-text-primary">Params List</div>}

      {params.map((param, index) => (
        <div key={index} className="param-item m-1 d-flex align-items-center justify-content-between">
          <div className="br-text-primary">
            <div>{param.paramName}</div>
          </div>
          <div className="d-flex">
            <div className="mx-2" role="button" onClick={() => handleEditParam(index)}>
              <i className="bi bi-pencil-square"></i>
            </div>
            <div role="button" onClick={() => handleDeleteParam(index)}>
              <i className="bi bi-trash"></i>
            </div>
          </div>
        </div>
      ))}

      {isFormVisible && (
        <ParamForm
          param={editIndex !== null ? params[editIndex] : null}
          onSubmit={handleAddOrEditParam}
          onCancel={() => setIsFormVisible(false)}
        />
      )}
    </div>
  );
}

FunctionParams.propTypes = {
  params: PropTypes.array.isRequired,
  setParams: PropTypes.func.isRequired,
};

export default FunctionParams;
