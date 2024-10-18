import { useState } from 'react';
import { CustomButtonField, CustomTextArea, CustomTextInput } from '../../../common/fields';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addModule, fetchModules } from '../redux/ApiClientActions';
const formStateTemplate = {
  name: '',
  description: '',
};
function AddModule({ setView }) {
  const [formState, setFormState] = useState(formStateTemplate);
  const { projectName } = useParams();
  const dispatch = useDispatch();
  const onChange = (prop, value) => {
    setFormState({ ...formState, [prop]: value });
  };

  const handleSubmit = async (payload) => {
    await dispatch(addModule({ projectName, payload })).unwrap();
    await dispatch(fetchModules({ projectName, payload: { category: 'api_client' } })).unwrap();
    setView('TEST');
  };
  return (
    <div className="row mt-3">
      <div className=" br-background-secondary br-text-primary p-1">
        <span className="mx-2 ">Module Settings</span>
      </div>
      <div className="row mt-2">
        <div className="col-sm-3">
          <label className=" br-text-primary mx-3">Name:</label>
        </div>
        <div className="col-sm-9">
          <CustomTextInput
            className=" form-control br-form-control form-control-sm"
            placeholder="Name"
            value={formState.name}
            onChange={(value) => onChange('name', value)}
          />
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-sm-3">
          <label className=" br-text-primary mx-3">Description:</label>
        </div>
        <div className="col-sm-9">
          <CustomTextArea
            name="description"
            value={formState.description}
            onChange={(value) => onChange('description', value)}
            config={{ groupClass: 'form-group my-2' }}
          />
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-sm-3"></div>
        <div className="col-sm-9 d-flex justify-content-end">
          <CustomButtonField
            className="btn btn-filled med-font"
            onClick={() => handleSubmit(formState)}
            label="Submit"
          />
        </div>
      </div>
    </div>
  );
}

export default AddModule;
