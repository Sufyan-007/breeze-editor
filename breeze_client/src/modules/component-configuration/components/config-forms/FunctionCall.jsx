import PropTypes from 'prop-types';

function FunctionCall({ onSubmit, onCancel, editMode }) {
  return <div>FunctionCall</div>;
}

FunctionCall.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  editMode: PropTypes.bool,
};
export default FunctionCall;
