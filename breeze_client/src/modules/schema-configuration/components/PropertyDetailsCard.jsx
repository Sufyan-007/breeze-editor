import { useState } from 'react';
import { CustomTextInput } from '../../../common/fields';
import Types from './Types';

function PropertyDetailsCard({
  changePropertyName,
  propKey,
  property,
  handleChange,
  moduleId,
  selectedSchema,
  onResolve,
}) {
  const [newName, setNewName] = useState(propKey);
  const [isOpen, setIsOpen] = useState(false);

  const handleResolve = (payload) => {
    const updatedPayload = { ...payload };
    updatedPayload['propertyDetails']['name'] = propKey;
    onResolve(updatedPayload);
  };
  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <>
      {isOpen ? (
        <div className="d-flex justify-content-between">
          <div className="card-body">
            <div className="row">
              <div className="col-2">
                <CustomTextInput
                  name="propertyName"
                  value={newName}
                  className={'form-control br-form-control form-control-sm'}
                  onChange={(val) => setNewName(val)}
                  onBlur={() => {
                    const trimmedNewName = newName.trim();
                    changePropertyName(propKey, trimmedNewName, property);
                    setNewName(trimmedNewName);
                  }}
                />
              </div>
              <div className="col-10">
                <Types
                  propertyData={property}
                  onUpdate={(val) => handleChange(propKey, val)}
                  moduleId={moduleId}
                  selectedSchema={selectedSchema}
                  propertyName={propKey}
                  onResolve={handleResolve}
                />
              </div>
            </div>
          </div>
          <button className="btn btn-sm btn-close btn-close-white m-1 " onClick={() => toggleOpen()} />
        </div>
      ) : (
        <div
          className="card-header d-flex justify-content-between"
          onClick={() => toggleOpen()}
          style={{ cursor: 'pointer' }}
        >
          <h6 className="mb-0 br-text-primary">{propKey}</h6>
          <i
            className="bi bi-trash3 br-text-primary"
            alt="delete"
            onClick={(e) => {
              e.stopPropagation();
              handleChange(propKey, null);
            }}
          ></i>
        </div>
      )}
    </>
  );
}

export default PropertyDetailsCard;
