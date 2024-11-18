import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { CustomSelectField } from '../../../common/fields';
import {
  BINARY_OPTIONS,
  FILE_OPTIONS,
  FORMDATA_OPTIONS,
  RAW_OPTIONS,
  TEXT_OPTIONS,
  URLENCODED_OPTIONS,
} from '../constants/Content-Types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchemas } from '../../schema-configuration/redux/schemaConfigActions';
import { useParams } from 'react-router-dom';

function BodySettings({ bodyData, onChange, moduleId }) {
  const [body, setBody] = useState(bodyData);
  const schemaList = useSelector((state) => state.schemas.schemaList[moduleId]);
  const { status } = useSelector((state) => state.schemas);
  const dispatch = useDispatch();
  const { projectName } = useParams();

  const optionsMap = {
    RAW: RAW_OPTIONS,
    URLENCODED: URLENCODED_OPTIONS,
    BINARY: BINARY_OPTIONS,
    FORMDATA: FORMDATA_OPTIONS,
    TEXT: TEXT_OPTIONS,
    FILE: FILE_OPTIONS,
  };

  const handleChanges = (prop, value) => {
    const newBody = { ...body };
    newBody[prop] = value;
    setBody(newBody);
    onChange('body', [newBody]);
  };
  const handleSchemaChange = (option) => {
    const newBody = { ...body };
    newBody['schema'] = option.schema;
    newBody['schema_name'] = option.value;
    setBody(newBody);
    onChange('body', [newBody]);
  };
  useEffect(() => {
    setBody(bodyData);
  }, [bodyData]);

  useEffect(() => {
    if (status === 'ready')
      dispatch(fetchSchemas({ projectName, payload: { category: 'models', module: moduleId } })).unwrap();
  }, [dispatch, projectName, moduleId, status]);

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

  const schemaOptions = schemaList
    ? Object.keys(schemaList)
        .filter((key) => !Object.hasOwn(schemaList[key], 'isUnresolved'))
        .map((key) => ({
          value: key,
          label: schemaList[key].name,
          schema: schemaList[key],
        }))
    : [];
  return body ? (
    <>
      <div className="rounded-0 br-text-primary br-background-secondary d-flex align-items-center justify-content-between">
        <CustomSelectField
          name="modeSelect"
          value={body.mode}
          onChange={(e) => handleChanges('mode', e)}
          options={[
            { label: 'Select', value: '' },
            { label: 'RAW', value: 'RAW' },
            { label: 'BINARY', value: 'BINARY' },
            { label: 'FORMDATA', value: 'FORMDATA' },
            { label: 'TEXT', value: 'TEXT' },
            { label: 'FILE', value: 'FILE' },
            { label: 'URLENCODED', value: 'URLENCODED' },
          ]}
          className="form-select br-form-select form-select-sm mt-3"
          config={{
            label: 'Mode',
            groupClass: 'form-group mb-2 mx-2 w-50',
          }}
        />

        <CustomSelectField
          name="valueSelect"
          value={body.content_type}
          onChange={(e) => handleChanges('content_type', e)}
          options={body?.mode ? optionsMap[body?.mode] : []}
          className="form-select br-form-select form-select-sm mt-3"
          config={{
            label: 'Content-Type',
            groupClass: 'form-group mb-2 mx-2 w-50',
          }}
        />
        <CustomSelectField
          name="schemaSelect"
          value={body.schema_name}
          onChange={(e) => handleSchemaChange(e)}
          sendSelectedOption={true}
          options={schemaOptions}
          className="form-select br-form-select form-select-sm mt-3"
          config={{
            label: 'Schema',
            groupClass: 'form-group mb-2 mx-2 w-50',
          }}
        />
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
  }),
  onChange: PropTypes.func.isRequired,
  moduleId: PropTypes.string,
};
export default BodySettings;
