import { useEffect, useState } from 'react';
import { CustomSelectField, CustomTextInput } from '../../../common/fields';
import PropTypes from 'prop-types';
function HeadersSetting({ headerData, onChange }) {
  const [headers, setHeaders] = useState(headerData);
  const handleInputChange = (index, field, value) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index] = { ...updatedHeaders[index], [field]: value };
    onChange('headers', updatedHeaders);
  };

  const handleDelete = (index) => {
    const updatedHeaders = [...headers];
    updatedHeaders.splice(index, 1);
    onChange('headers', updatedHeaders);
  };
  useEffect(() => {
    setHeaders(headerData);
  }, [headerData]);
  // const renderError = (errors) => {
  //   if (!errors) return null;
  //   return (
  //     <div className="text-danger">
  //       {Object.entries(errors).map(([key, messages]) => (
  //         <div key={key}>
  //           {messages.map((message, idx) => (
  //             <div key={idx}>
  //               {key}: {message}
  //             </div>
  //           ))}
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  return (
    <>
      {headers && headers.length > 0 ? (
        headers.map((header, index) => (
          <div
            key={index}
            className="my-2 rounded-0 br-text-primary br-background-secondary d-flex align-items-center justify-content-between"
          >
            <div style={{ width: '90%' }} className="d-flex align-items-center">
              <CustomTextInput
                className=" form-control br-form-control form-control-sm"
                placeholder="Key"
                config={{
                  label: 'Key',
                  groupClass: 'form-group mb-2 mx-2 w-50',
                }}
                value={header.key}
                onChange={(value) => handleInputChange(index, 'key', value)}
              />
              <CustomSelectField
                name="valueSelect"
                value={header.type}
                onChange={(e) => handleInputChange(index, 'type', e)}
                options={[
                  { label: 'Select', value: '' },
                  { label: 'USER INPUT', value: 'USER_INPUT' },
                  { label: 'LOCALSTORAGE', value: 'LOCAL_STORAGE' },
                  { label: 'SESSION STORAGE', value: 'SESSION_STORAGE' },
                ]}
                className="form-select br-form-select form-select-sm mt-3"
                config={{
                  label: 'Value Type',
                  groupClass: 'form-group mb-2 mx-2 w-50',
                }}
              />
              <CustomSelectField
                name="dataTypeSelect"
                value={header.data_type || ''}
                onChange={(e) => {
                  handleInputChange(index, 'data_type', e);
                }}
                options={[
                  { value: '', label: 'Select' },
                  { label: 'String', value: 'string' },
                  { label: 'Numeric', value: 'numeric' },
                  { label: 'Object', value: 'object' },
                  { label: 'Boolean', value: 'boolean' },
                ]}
                className="form-select br-form-select form-select-sm mt-3"
                config={{
                  label: 'Data Type',
                  groupClass: 'form-group mb-2 mx-2 w-50',
                }}
              />
              {header.type === 'STATIC' ? (
                <CustomTextInput
                  className=" form-control br-form-control form-control-sm"
                  placeholder="Key"
                  config={{
                    label: 'Value',
                    groupClass: 'form-group mb-2 mx-2 w-50',
                  }}
                  value={header.value}
                  onChange={(value) => handleInputChange(index, 'value', value)}
                />
              ) : header.type === 'LOCAL_STORAGE' || header.type === 'SESSION_STORAGE' ? (
                <CustomTextInput
                  className=" form-control br-form-control form-control-sm"
                  placeholder="Storage Key"
                  config={{
                    label: 'Storage Key',
                    groupClass: 'form-group mb-2 mx-2 w-50',
                  }}
                  value={header.storage_key}
                  onChange={(value) => handleInputChange(index, 'storage_key', value)}
                />
              ) : null}
            </div>
            <div className="d-flex align-items-center">
              <i
                className="bi bi-trash3 mt-4"
                alt="delete"
                height={25}
                width={25}
                onClick={() => handleDelete(index)}
              ></i>
            </div>
          </div>
        ))
      ) : (
        <div className="d-flex justify-content-center">
          <span className="br-text-primary">-----No Headers Present-----</span>
        </div>
      )}
    </>
  );
}
HeadersSetting.propTypes = {
  headerData: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.string,
      storage_key: PropTypes.string,
    })
  ),
  onChange: PropTypes.func.isRequired,
};
export default HeadersSetting;
