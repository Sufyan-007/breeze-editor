import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// import { getApiSchemaDetails } from '../services/ApiService';
// import { useParams } from 'react-router';
import { CustomSelectField, CustomTextInput } from '../../../common/fields';

function BodySettings({ bodyData, onChange, moduleId }) {
  console.log(moduleId, 'moduleid in bodyyyyyyyyyy');
  const [body, setBody] = useState(bodyData);
  // const [schemaList, setSchemaList] = useState([]);
  // const { projectName } = useParams();
  // const fetchSchemasList = useCallback(
  //   async (schemaName, moduleId) => {
  //     try {
  //       const result = await getApiSchemaDetails(projectName, schemaName, moduleId);
  //       if (schemaName) {
  //         return result;
  //       } else {
  //         setSchemaList(result[0].schemas);
  //       }
  //       console.log(result, 'result');
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   [projectName]
  // );

  // useEffect(() => {
  //   if (moduleId) {
  //     fetchSchemasList(null, moduleId);
  //   }
  // }, [fetchSchemasList, moduleId]);

  // const handleSchemaChange = async (value) => {
  //   const updatedSchema = await fetchSchemasList(value, moduleId);
  //   console.log(updatedSchema, 'updatedSchema');
  //   setBody((state) => {
  //     state.schema = updatedSchema;
  //     state.schema_name = value;
  //     onChange('body', [state]);
  //     return { ...state };
  //   });
  // };

  const handleChanges = (prop, value) => {
    console.log(prop, value);
    const newBody = { ...body };
    newBody[prop] = value;
    setBody(newBody);
    onChange('body', [newBody]);
  };

  useEffect(() => {
    setBody(bodyData);
  }, [bodyData]);

  const renderError = (errors) => {
    if (!errors) return null;
    return (
      <div className="text-danger">
        {Object.entries(errors).map(([key, messages]) => (
          <div key={key}>
            {messages.map((message, idx) => (
              <div key={idx}>
                {key}: {message}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // const schemaOptions = schemaList.map((schema) => ({
  //   label: schema.name,
  //   value: schema.id,
  // }));
  return body ? (
    <>
      <div className="rounded-0 br-text-primary br-background-secondary d-flex align-items-center justify-content-between">
        <CustomSelectField
          name="valueSelect"
          value={body.content_type}
          onChange={(e) => handleChanges('content_type', e)}
          options={[
            { label: 'Select', value: '' },
            { label: 'JSON', value: 'JSON' },
            { label: 'TEXT', value: 'TEXT' },
            { label: 'HTML', value: 'HTML' },
          ]}
          className="form-select br-form-select form-select-sm mt-3"
          config={{
            label: 'Content-Type',
            groupClass: 'form-group mb-2 mx-2 w-50',
          }}
        />
        {body.content_type === 'TEXT' ? (
          <CustomTextInput
            className=" form-control br-form-control form-control-sm"
            placeholder="Value"
            config={{
              label: 'Value',
              groupClass: 'form-group mb-2 mx-2 w-50',
            }}
            value={body.raw_content}
            onChange={(e) => handleChanges('raw_content', e)}
          />
        ) : (
          <>
            <CustomSelectField
              name="modeSelect"
              value={body.mode}
              onChange={(e) => handleChanges('mode', e)}
              options={[
                { label: 'Select', value: '' },
                { label: 'RAW', value: 'RAW' },
                { label: 'BINARY', value: 'BINARY' },
                { label: 'URLENCODED', value: 'URLENCODED' },
              ]}
              className="form-select br-form-select form-select-sm mt-3"
              config={{
                label: 'Mode',
                groupClass: 'form-group mb-2 mx-2 w-50',
              }}
            />
            <CustomSelectField
              name="schemaSelect"
              value={body.schema_name}
              // onChange={(e) => handleSchemaChange(e)}
              // options={schemaOptions}
              className="form-select br-form-select form-select-sm mt-3"
              config={{
                label: 'Schema',
                groupClass: 'form-group mb-2 mx-2 w-50',
              }}
            />
          </>
        )}
      </div>
      {renderError(body.errors)}
    </>
  ) : (
    <div className="br-text-primary">-----No Body Present-----</div>
  );
}
BodySettings.propTypes = {
  bodyData: PropTypes.shape({
    content_type: PropTypes.string,
    raw_content: PropTypes.string,
    mode: PropTypes.string,
    schema: PropTypes.object,
    schema_name: PropTypes.string,
    errors: PropTypes.object,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  moduleId: PropTypes.string.isRequired,
};
export default BodySettings;
